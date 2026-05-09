/**
 * funcs.ts — UI controller
 **/

import { boardInit, isWin, Board }                        from "~src/board";
import { Puzzle, Dir, Color }                             from "~src/puzzle";
import { Action, State, Funct, popStateStack,
         actionGame, actionFunct, verifyArrayFunc }       from "~src/gameState";
import { Robot, robotIsFell, moveForward,
         turnRight, turnLeft }                            from "~src/robot";
import { Stack, nil, cons, call as stackCall,
         stackIsEmpty, head, tail, isOverStack }          from "~src/stack";
import { Square, out, squareIsOut }                       from "~src/square";

// ─── Types ────────────────────────────────────────────────────────────

/** Color filter for an instruction */
type FilterColor = Color.RED | Color.GREEN | Color.BLUE | Color.NOCOLOR; // NOCOLOR = any

/** An instruction of the program edited in the UI */
interface UiInstr {
  kind:   "MOVE" | "LEFT" | "RIGHT" | "TURN" | "CALL_1" | "CALL_2" | "CALL_3" | "CALL_4" | "CALL_5" | "VOID";
  filter: FilterColor;
}

/** UI program: 5 function slots */
type UiProgram = UiInstr[][];

/** Snapshot for the "back" button */
interface Snapshot {
  state: State;
  step:  number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PUZZLE_URL  = "../share/puzzles.json";
const BOARD_ID    = "visualizer_board";
const ROBOT_ID    = "robot-cell";
const MAX_STEPS   = 2000;

const ROBOT_GLYPHS: Partial<Record<Dir, string>> = {
  [Dir.NORD]:  "▲",
  [Dir.EAST]:  "▶",
  [Dir.SOUTH]: "▼",
  [Dir.WEST]:  "◀",
};

const ACTION_SYMBOLS: Record<UiInstr["kind"], string> = {
  MOVE:   "↑",
  LEFT:   "↰",
  RIGHT:  "↱",
  TURN:   "↓",
  CALL_1: "F1",
  CALL_2: "F2",
  CALL_3: "F3",
  CALL_4: "F4",
  CALL_5: "F5",
  VOID:   "",
};

const COLOR_BG: Record<FilterColor, string> = {
  [Color.NOCOLOR]: "#3a3a4a",
  [Color.RED]:     "#8b1a2a",
  [Color.GREEN]:   "#0a4a28",
  [Color.BLUE]:    "#0a2a6b",
};

const COLOR_ACCENT: Record<FilterColor, string> = {
  [Color.NOCOLOR]: "#888",
  [Color.RED]:     "#ff4d6d",
  [Color.GREEN]:   "#06d6a0",
  [Color.BLUE]:    "#00e5ff",
};

// ─── Global State ────────────────────────────────────────────────────────────

let puzzles:    Puzzle[]    = [];
let puzzle:     Puzzle | null = null;
let uiProgram:  UiProgram   = Array.from({ length: 5 }, () => []);
let gameState:  State | null = null;
let history:    Snapshot[]  = [];   // pour le bouton "reculer"
let stepCount:  number      = 0;
let runTimer:   number | null = null;

// current slot selection for the palette
let selectedSlot: { fi: number; si: number; el: HTMLElement } | null = null;

// ─── Puzzle Loading ──────────────────────────────────────────────────────────

async function fetchPuzzles(): Promise<Puzzle[]> {
  const r = await fetch(PUZZLE_URL);
  if (!r.ok) throw new Error(`Fetch failed: ${r.status} ${r.url}`);
  const raw: unknown[] = await r.json();
  // Le JSON contient des strings de copyright en tête — on filtre
  return raw.filter((x): x is Puzzle =>
    typeof x === "object" && x !== null && "id" in x
  );
}

// ─── Init / Reset ────────────────────────────────────────────────────────────

function loadPuzzleById(id: number): void {
  const p = puzzles.find(x => x.id === id);
  if (!p) { alert(`Puzzle #${id} introuvable.`); return; }
  puzzle = p;
  uiProgram = puzzle.subs.map(size => Array.from({ length: size }, (): UiInstr => ({ kind: "VOID", filter: Color.NOCOLOR })));
  // Initialize execution when puzzle changes
  resetExecution();
  renderPuzzleInfo();
  renderBoard(puzzle.board);
  renderFunctions();
  buildPalette();
}

function resetExecution(): void {
  stopRun();
  if (!puzzle) return;
  const board = boardInit(puzzle);
  const initStack: Stack<Action> = nil;

  gameState = {
    robot: { square: board.start, dir: puzzle.robotDir as Dir },
    board,
    stack: initStack,
  };

  // Build Funct[] from uiProgram and push F1 onto the stack
  const functs = buildFuncts();
  gameState = {
    ...gameState,
    stack: buildInitStack(functs[0]),
  };

  history    = [];
  stepCount  = 0;
  renderAll();
}

/** Convertit le UiProgram en tableaux de Action (Funct[]) */
function buildFuncts(): Funct[] {
  // Tableaux mutables pour permettre les références circulaires (F1 appelle F1)
  const functs: Funct[] = Array.from({ length: 5 }, () => []);

  functs.forEach((_, fi) => {
    const slots = uiProgram[fi] ?? [];
    // actionFunct attend les Funct reversées (comme main.ts le fait)
    functs[fi] = slots
      .filter(s => s.kind !== "VOID")
      .map(s => buildAction(s, functs))
      .reverse();
  });

  return functs;
}

function buildAction(instr: UiInstr, functs: Funct[]): Action {
  const cond = colorCondition(instr.filter);

  switch (instr.kind) {
    case "MOVE":   return actionGame(g => moveForward(g),  cond);
    case "LEFT":   return actionGame(g => turnLeft(g),     cond);
    case "RIGHT":  return actionGame(g => turnRight(g),    cond);
    case "TURN":   return actionGame(g => ({ robot: { ...g.robot, dir: ((g.robot.dir + 2) % 4) as Dir }, board: g.board }), cond);
    case "CALL_1": return actionFunct(() => functs[0], cond);
    case "CALL_2": return actionFunct(() => functs[1], cond);
    case "CALL_3": return actionFunct(() => functs[2], cond);
    case "CALL_4": return actionFunct(() => functs[3], cond);
    case "CALL_5": return actionFunct(() => functs[4], cond);
    default:       return (s: State) => ({ ...s, stack: tail(s.stack) });
  }
}

/** Condition de couleur : null = toujours vrai */
function colorCondition(filter: FilterColor): ((r: Robot) => boolean) | undefined {
  if (filter === Color.NOCOLOR) return undefined;
  return (r: Robot) => r.square.color === filter;
}

function buildInitStack(f1: Funct): Stack<Action> {
  // f1 est déjà reversée par buildFuncts — on empile directement
  // head de la stack = dernière instruction empilée = première de F1
  return f1.reduce<Stack<Action>>(
    (acc, a) => cons(a, acc),
    nil
  );
}

// ─── Rendering ──────────────────────────────────────────────────────────────

function renderAll(): void {
  if (!puzzle || !gameState) return;
  renderBoard(gameState.board.board.map(sq => squareToChar(sq, puzzle!.board)).join(""));
  placeRobot(gameState.robot);
  renderStack();
  updateControls();
}

/** Reconstruct a board string from current squares (to reflect collected stars) */
function squareToChar(sq: Square, originalBoard: string): string {
  if (squareIsOut(sq)) return " ";
  const idx = sq.position.x * 16 + sq.position.y; // puzzleWidth = 16
  const orig = originalBoard[idx] ?? " ";
  if (sq.isStar) return orig; // uppercase = star still there
  // If original was a star (uppercase) but sq.isStar = false → return lowercase
  if (orig >= 'A' && orig <= 'Z') return orig.toLowerCase();
  return orig;
}

function renderPuzzleInfo(): void {
  if (!puzzle) return;
  (document.getElementById("puzzle-title")  as HTMLElement).innerText = puzzle.title;
  (document.getElementById("puzzle-about")  as HTMLElement).innerText = puzzle.about;
  (document.getElementById("puzzle-id-input") as HTMLInputElement).value = String(puzzle.id);
}

function renderBoard(board: string): void {
  const tbody = document.getElementById(BOARD_ID) as HTMLTableSectionElement;
  tbody.innerHTML = "";

  const W = 16; // puzzleWidth
  const H = 12; // puzzleHeight
  for (let row = 0; row < H; row++) {
    const tr = tbody.insertRow();
    for (let col = 0; col < W; col++) {
      const ch = board[row * W + col] ?? " ";
      const td = tr.insertCell();
      td.style.width = td.style.height = "36px";
      td.style.textAlign = "center";
      td.style.padding = "0";
      td.style.position = "relative";
      td.style.border = "1px solid rgba(255,255,255,0.04)";

      switch (ch.toLowerCase()) {
        case "r": td.className = "red-tile";   td.style.background = "#6b1a2a"; break;
        case "g": td.className = "green-tile"; td.style.background = "#0d4a32"; break;
        case "b": td.className = "blue-tile";  td.style.background = "#0d2a6b"; break;
        default:  td.style.background = "#0a0c10"; break;
      }

      // Étoile
      if (ch >= "A" && ch <= "Z") {
        const star = document.createElement("div");
        star.style.cssText = "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:15px;pointer-events:none;";
        star.innerText = "★";
        const starColors: Record<string, string> = { R: "#ff4d6d", G: "#06d6a0", B: "#00e5ff" };
        star.style.color = starColors[ch] ?? "#ffd166";
        td.appendChild(star);
      }
    }
  }
}

function placeRobot(robot: Robot): void {
  // Supprimer le précédent
  document.getElementById(ROBOT_ID)?.removeAttribute("id");
  const old = document.querySelector(".robot-rendered");
  if (old) {
    old.classList.remove("robot-rendered");
    old.innerHTML = old.innerHTML.replace(/<span[^>]*robot[^>]*>.*?<\/span>/g, "");
  }

  if (squareIsOut(robot.square)) return;

  const { x, y } = robot.square.position;
  const tbody = document.getElementById(BOARD_ID) as HTMLTableSectionElement;
  const row = tbody.rows[x];
  if (!row) return;
  const cell = row.cells[y];
  if (!cell) return;

  cell.id = ROBOT_ID;
  cell.classList.add("robot-rendered");

  const span = document.createElement("span");
  span.style.cssText = "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:20px;color:#00e5ff;filter:drop-shadow(0 0 6px #00e5ff);z-index:2;pointer-events:none;";
  span.innerText = ROBOT_GLYPHS[robot.dir] ?? "●";
  cell.appendChild(span);
}

// ─── Functions / Slots ───────────────────────────────────────────────────────

function renderFunctions(): void {
  const container = document.getElementById("func-rows")!;
  container.innerHTML = "";
  if (!puzzle) return;
  // Render each function with its slots

  puzzle.subs.forEach((size, fi) => {
    if (size === 0) return;
    const row = document.createElement("div");
    row.className = "func-row";
    row.style.cssText = "display:flex;align-items:center;gap:8px;margin-bottom:10px;";

    const label = document.createElement("div");
    label.className = "func-label";
    label.style.cssText = "font-family:'Share Tech Mono',monospace;font-size:13px;color:#00e5ff;width:28px;flex-shrink:0;";
    label.innerText = `F${fi + 1}`;
    row.appendChild(label);

    const slots = document.createElement("div");
    slots.style.cssText = "display:flex;gap:5px;flex-wrap:wrap;";

    for (let si = 0; si < size; si++) {
      const btn = document.createElement("button");
      btn.className = "slot";
      btn.style.cssText = `
        width:36px;height:36px;border-radius:5px;
        border:1px solid #2a3040;background:#161923;
        color:#e0e6f0;font-size:12px;cursor:pointer;
        display:flex;align-items:center;justify-content:center;
        transition:border-color 0.15s,background 0.15s;
        position:relative;font-family:'Share Tech Mono',monospace;
      `;
      btn.dataset.fi = String(fi);
      btn.dataset.si = String(si);
      updateSlotDisplay(btn, fi, si);
      btn.addEventListener("click", () => openPalette(btn, fi, si));
      slots.appendChild(btn);
      // Slot created for instruction
    }

    row.appendChild(slots);
    container.appendChild(row);
  });
}

function updateSlotDisplay(btn: HTMLElement, fi: number, si: number): void {
  const instr = uiProgram[fi]?.[si];
  if (!instr || instr.kind === "VOID") {
    btn.innerText = "";
    btn.style.background = "#161923";
    btn.style.borderColor = "#2a3040";
    // remove dot
    const dot = btn.querySelector(".cdot");
    if (dot) dot.remove();
    return;
  }

  btn.innerText = ACTION_SYMBOLS[instr.kind];
  btn.style.background = COLOR_BG[instr.filter];
  btn.style.borderColor = COLOR_ACCENT[instr.filter];

  // dot couleur
  let dot = btn.querySelector(".cdot") as HTMLElement | null;
  if (!dot) {
    dot = document.createElement("div");
    dot.className = "cdot";
    dot.style.cssText = "position:absolute;bottom:3px;right:3px;width:5px;height:5px;border-radius:50%;";
    btn.appendChild(dot);
  }
  dot.style.background = instr.filter === Color.NOCOLOR ? "transparent" : COLOR_ACCENT[instr.filter];
}

// ─── Palette ─────────────────────────────────────────────────────────────────

const KINDS: UiInstr["kind"][] = ["MOVE","LEFT","RIGHT","TURN","CALL_1","CALL_2","CALL_3","CALL_4","CALL_5"];
const FILTERS: FilterColor[] = [Color.NOCOLOR, Color.RED, Color.GREEN, Color.BLUE];

function buildPalette(): void {
  const pal = document.getElementById("palette")!;
  pal.innerHTML = "";
  if (!puzzle) return;

  FILTERS.forEach(filter => {
    const row = document.createElement("div");
    row.className = "palette-row";
    row.style.cssText = "display:flex;gap:5px;margin-bottom:5px;";

    // Filter CALL_* based on available subs
    const availableKinds = KINDS.filter(k => {
      if (!k.startsWith("CALL_")) return true;
      const idx = parseInt(k.slice(-1)) - 1;
      return (puzzle!.subs[idx] ?? 0) > 0;
    });

    availableKinds.forEach(kind => {
      const btn = document.createElement("button");
      btn.className = "palette-btn";
      btn.innerText = ACTION_SYMBOLS[kind];
      btn.style.cssText = `
        width:32px;height:32px;border-radius:5px;border:none;cursor:pointer;
        font-size:11px;font-family:'Share Tech Mono',monospace;color:white;font-weight:bold;
        background:${COLOR_BG[filter]};
        border:1px solid ${filter === Color.NOCOLOR ? "#444" : COLOR_ACCENT[filter]};
        transition:transform 0.1s,opacity 0.1s;
      `;
      btn.addEventListener("mouseenter", () => { btn.style.transform = "scale(1.12)"; });
      btn.addEventListener("mouseleave", () => { btn.style.transform = "scale(1)"; });
      btn.addEventListener("click", e => {
        e.stopPropagation();
        applyInstr(kind, filter);
      });
      row.appendChild(btn);
    });

    // Clear button
    const clear = document.createElement("button");
    clear.className = "palette-btn palette-clear";
    clear.innerText = "✕";
    clear.style.cssText = `
      width:32px;height:32px;border-radius:5px;cursor:pointer;
      font-size:13px;font-family:'Share Tech Mono',monospace;
      background:#2a2a2a;color:#888;border:1px solid #444;
      transition:transform 0.1s;
    `;
    clear.addEventListener("mouseenter", () => { clear.style.transform = "scale(1.12)"; });
    clear.addEventListener("mouseleave", () => { clear.style.transform = "scale(1)"; });
    clear.addEventListener("click", e => {
      e.stopPropagation();
      applyInstr("VOID", Color.NOCOLOR);
    });
    row.appendChild(clear);
    pal.appendChild(row);
    // Palette row created
  });
}

function openPalette(btn: HTMLElement, fi: number, si: number): void {
  selectedSlot = { fi, si, el: btn };
  const pal = document.getElementById("palette")!;
  const rect = btn.getBoundingClientRect();

  pal.style.display = "block";
  pal.style.left = `${rect.left + window.scrollX}px`;
  pal.style.top  = `${rect.bottom + window.scrollY + 6}px`;

  // Close if clicking outside
  setTimeout(() => {
    document.addEventListener("click", closePaletteOutside);
  }, 0);
}

function closePaletteOutside(e: MouseEvent): void {
  const pal = document.getElementById("palette");
  if (pal && !pal.contains(e.target as Node)) {
    closePalette();
  }
}

function closePalette(): void {
  const pal = document.getElementById("palette")!;
  pal.style.display = "none";
  selectedSlot = null;
  document.removeEventListener("click", closePaletteOutside);
}

function applyInstr(kind: UiInstr["kind"], filter: FilterColor): void {
  if (!selectedSlot) return;
  const { fi, si, el } = selectedSlot;
  if (!uiProgram[fi]) return;
  uiProgram[fi][si] = { kind, filter };
  updateSlotDisplay(el, fi, si);
  closePalette();
  // Rebuild execution state from start (programme a changé)
  resetExecution();
}

// ─── Stack Rendering ────────────────────────────────────────────────────────

/**
 * The stack from gameState.ts is a recursive functional structure.
 * Cannot iterate easily without popping it.
 * Just display program slots with active cursor.
 */
function renderStack(): void {
  const container = document.getElementById("stack-display")!;
  container.innerHTML = "";
  if (!gameState) return;

  // Display program functions with active instruction marking
  // Simply display uiProgram and highlight next F1 instruction
  // (simple approach since internal stack is opaque)

  if (stackIsEmpty(gameState.stack)) {
    container.innerText = "Stack vide";
    return;
  }

  // Display call stack depth summary
  const depth = gameState.stack.nb;
  const info = document.createElement("div");
  info.style.cssText = "font-family:'Share Tech Mono',monospace;font-size:11px;color:#5a6480;margin-bottom:8px;";
  info.innerText = `Depth: ${depth} nested call(s)`;
  container.appendChild(info);

  // Display each program function for reference
  uiProgram.forEach((slots, fi) => {
    if (!puzzle || puzzle.subs[fi] === 0) return;
    const frame = document.createElement("div");
    frame.style.cssText = `
      background:#161923;border-radius:6px;padding:8px 10px;margin-bottom:8px;
      border-left:3px solid #2a3040;
    `;
    const lbl = document.createElement("div");
    lbl.style.cssText = "font-family:'Share Tech Mono',monospace;font-size:11px;color:#5a6480;margin-bottom:6px;";
    lbl.innerText = `F${fi + 1}`;
    frame.appendChild(lbl);

    const instrRow = document.createElement("div");
    instrRow.style.cssText = "display:flex;gap:4px;flex-wrap:wrap;";
    slots.forEach((instr, si) => {
      const sp = document.createElement("span");
      sp.style.cssText = `
        width:28px;height:28px;border-radius:4px;display:inline-flex;
        align-items:center;justify-content:center;
        font-family:'Share Tech Mono',monospace;font-size:10px;color:white;
        background:${COLOR_BG[instr.filter]};
        ${instr.kind === "VOID" ? "opacity:0.3;" : ""}
      `;
      sp.innerText = ACTION_SYMBOLS[instr.kind] || "·";
      instrRow.appendChild(sp);
    });
    frame.appendChild(instrRow);
    container.appendChild(frame);
  });
}

// ─── Controls ────────────────────────────────────────────────────────────────

function updateControls(): void {
  const stepEl = document.getElementById("step-num")!;
  stepEl.innerText = String(stepCount);

  const statusEl = document.getElementById("status-msg")!;

  if (!gameState) return;
  // Update UI controls based on game state
  if (robotIsFell(gameState.robot)) {
    setStatus(statusEl, "HORS PLATEAU", "lost");
    stopRun();
  } else if (isWin(gameState.board)) {
    setStatus(statusEl, "GAGNÉ 🎉", "won");
    stopRun();
  } else if (stackIsEmpty(gameState.stack)) {
    setStatus(statusEl, "FIN DE PROGRAMME", "lost");
    stopRun();
  } else if (isOverStack(gameState.stack)) {
    setStatus(statusEl, "STACK OVERFLOW", "lost");
    stopRun();
  } else {
    setStatus(statusEl, "EN COURS", "play");
  }
}

function setStatus(el: HTMLElement, text: string, kind: "won" | "lost" | "play"): void {
  el.innerText = text;
  el.className = `status-${kind}`;
  el.style.cssText = {
    won:  "background:rgba(6,214,160,0.15);color:#06d6a0;border:1px solid #06d6a0;padding:6px 14px;border-radius:20px;font-weight:600;font-size:13px;",
    lost: "background:rgba(255,77,109,0.15);color:#ff4d6d;border:1px solid #ff4d6d;padding:6px 14px;border-radius:20px;font-weight:600;font-size:13px;",
    play: "background:rgba(0,229,255,0.1);color:#00e5ff;border:1px solid #00e5ff;padding:6px 14px;border-radius:20px;font-weight:600;font-size:13px;",
  }[kind];
}

function isGameOver(): boolean {
  if (!gameState) return true;
  return robotIsFell(gameState.robot) ||
         isWin(gameState.board) ||
         stackIsEmpty(gameState.stack) ||
         isOverStack(gameState.stack);
}

function doStep(): void {
  if (!gameState || isGameOver()) return;

  // Save snapshot for undo
  history.push({ state: gameState, step: stepCount });
  if (history.length > 500) history.shift(); // limit memory

  try {
    gameState = popStateStack(gameState);
    stepCount++;
    renderAll();
  } catch (e) {
    stopRun();
    alert("Erreur: " + (e as Error).message);
  }
}

function doBack(): void {
  const snap = history.pop();
  if (!snap) return;
  gameState = snap.state;
  stepCount = snap.step;
  renderAll();
}

function doReset(): void {
  resetExecution();
}

function stopRun(): void {
  if (runTimer !== null) {
    clearInterval(runTimer);
    runTimer = null;
  }
  const btn = document.getElementById("btn-run")!;
  btn.innerText = "▶";
  btn.title = "Play";
}

function startRun(): void {
  const btn = document.getElementById("btn-run")!;
  btn.innerText = "⏸";
  btn.title = "Pause";

  runTimer = window.setInterval(() => {
    if (isGameOver()) {
      stopRun();
      return;
    }
    doStep();
  }, 120);
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────

window.addEventListener("load", async () => {
  puzzles = await fetchPuzzles();

  // Load first puzzle by default
  if (puzzles.length > 0) {
    loadPuzzleById(puzzles[0].id);
  }

  // Load button handler
  document.getElementById("load-btn")!.addEventListener("click", () => {
    const idStr = (document.getElementById("puzzle-id-input") as HTMLInputElement).value;
    const id = parseInt(idStr, 10);
    if (!isNaN(id)) loadPuzzleById(id);
  });

  // Enter key in input field
  (document.getElementById("puzzle-id-input") as HTMLInputElement).addEventListener("keydown", e => {
    if (e.key === "Enter") {
      document.getElementById("load-btn")!.click();
    }
  });

  // Step forward button
  document.getElementById("btn-step")!.addEventListener("click", () => {
    stopRun();
    doStep();
  });

  // Step back button
  document.getElementById("btn-back")!.addEventListener("click", () => {
    stopRun();
    doBack();
  });

  // Run / Pause button
  document.getElementById("btn-run")!.addEventListener("click", () => {
    if (runTimer !== null) {
      stopRun();
    } else {
      if (isGameOver()) doReset();
      startRun();
    }
  });

  // Reset button
  document.getElementById("btn-reset")!.addEventListener("click", () => {
    doReset();
  });
});