import { Dir, Color, puzzleWidth, puzzleHeight, Puzzle } from "~src/puzzle";
import { Square, out, squareIsOut } from "~src/square";
import { Board, boardInit, isWin, move2square, removeStar } from "~src/board";
import { Robot, moveForward, turnRight, turnLeft } from "~src/robot";
import { Stack, nil, cons, stackIsEmpty, head, tail, call, isOverStack } from "~src/stack";
import { Action, State, Funct, actionGame, actionFunct } from "~src/gameState";

// ─── Types UI ──────────────────────────────────────────────────────────────────

type InstrDef = {
  action: "MOVE" | "LEFT" | "RIGHT" | "TURN" | "CALL_1" | "CALL_2" | "CALL_3" | "CALL_4" | "CALL_5" | "VOID";
  color: Color;
};

type Program = {
  F1: InstrDef[];
  F2: InstrDef[];
  F3: InstrDef[];
  F4: InstrDef[];
  F5: InstrDef[];
};

type UIState = {
  puzzle: Puzzle;
  program: Program;
  gameState: State | null;
  history: State[];
  status: "idle" | "running" | "won" | "lost";
  steps: number;
};

// ─── Conversion programme → Funct[] ────────────────────────────────────────────

function colorCondition(c: Color): ((r: Robot) => boolean) | undefined {
  if (c === Color.NOCOLOR) return undefined;
  return (robot: Robot) => robot.square.color === c;
}

function instrDefToAction(instr: InstrDef, getFuncts: () => Funct[]): Action {
  const cond = colorCondition(instr.color);
  switch (instr.action) {
    case "MOVE":   return actionGame(moveForward, cond);
    case "LEFT":   return actionGame(turnLeft,    cond);
    case "RIGHT":  return actionGame(turnRight,   cond);
    case "TURN":   return actionGame(
      (g) => { const r = turnRight(g); return turnRight(r); }, cond);
    case "CALL_1": return actionFunct(() => getFuncts()[0], cond);
    case "CALL_2": return actionFunct(() => getFuncts()[1], cond);
    case "CALL_3": return actionFunct(() => getFuncts()[2], cond);
    case "CALL_4": return actionFunct(() => getFuncts()[3], cond);
    case "CALL_5": return actionFunct(() => getFuncts()[4], cond);
    case "VOID":
    default:
      return (s: State) => ({ ...s, stack: tail(s.stack) });
  }
}

function programToFuncts(program: Program): Funct[] {
  const keys: (keyof Program)[] = ["F1", "F2", "F3", "F4", "F5"];
  let functs: Funct[] = keys.map(() => []);
  const getFuncts = () => functs;

  functs = keys.map((k) =>
    program[k]
      .filter((i) => i.action !== "VOID")
      .map((i) => instrDefToAction(i, getFuncts))
      .reverse()
  );

  return functs;
}

// ─── Init état de jeu ──────────────────────────────────────────────────────────

function buildInitialState(puzzle: Puzzle, program: Program): State {
  const board = boardInit(puzzle);
  const functs = programToFuncts(program);
  const f1 = functs[0];
  const stack: Stack<Action> = f1.reduce(
    (acc, action) => cons(action, acc),
    nil as Stack<Action>
  );
  return {
    robot: { square: board.start, dir: puzzle.robotDir },
    board,
    stack,
  };
}

// ─── Step ──────────────────────────────────────────────────────────────────────

type StepResult =
  | { kind: "ok"; state: State }
  | { kind: "won" }
  | { kind: "lost"; reason: string };

function stepOnce(state: State): StepResult {
  if (isOverStack(state.stack))
    return { kind: "lost", reason: "Stack overflow (récursion trop profonde)" };
  if (stackIsEmpty(state.stack))
    return { kind: "lost", reason: "Programme terminé sans résoudre le puzzle" };

  const action = head(state.stack);
  const next = action(state);

  if (squareIsOut(next.robot.square))
    return { kind: "lost", reason: "Le robot est sorti du plateau" };
  if (isWin(next.board))
    return { kind: "won" };

  return { kind: "ok", state: next };
}

// ─── Rendu du plateau ──────────────────────────────────────────────────────────

const ROBOT_CHARS: Record<number, string> = {
  [Dir.EAST]:  "→",
  [Dir.SOUTH]: "↓",
  [Dir.WEST]:  "←",
  [Dir.NORD]:  "↑",
};

function renderBoard(puzzle: Puzzle, state: State | null): void {
  const tbody = document.getElementById("game-board") as HTMLTableSectionElement;
  if (!tbody) return;
  tbody.innerHTML = "";

  const board = state?.board ?? boardInit(puzzle);
  const robotSquare = state?.robot.square ?? null;
  const robotDir = state?.robot.dir ?? puzzle.robotDir;

  for (let row = 0; row < puzzleHeight; row++) {
    const tr = tbody.insertRow();
    for (let col = 0; col < puzzleWidth; col++) {
      const sq = board.board[row * puzzleWidth + col];
      const td = tr.insertCell();

      if (squareIsOut(sq)) {
        td.className = "empty-cell";
        continue;
      }

      const colorName = sq.color === Color.RED ? "red"
                      : sq.color === Color.GREEN ? "green"
                      : sq.color === Color.BLUE ? "blue"
                      : "empty-cell";
      td.className = colorName + (sq.isStar ? " star-cell" : "");

      if (sq === robotSquare) {
        td.classList.add("robot-cell");
        td.textContent = ROBOT_CHARS[robotDir] ?? "?";
      } else if (sq.isStar) {
        td.textContent = "★";
      }
    }
  }
}

// ─── Rendu des fonctions ───────────────────────────────────────────────────────

const ACTION_SYMBOLS: Record<string, string> = {
  MOVE: "↑", LEFT: "↰", RIGHT: "↱", TURN: "↕",
  CALL_1: "F1", CALL_2: "F2", CALL_3: "F3", CALL_4: "F4", CALL_5: "F5",
  VOID: "",
};

const COLOR_BG: Record<number, string> = {
  [Color.NOCOLOR]: "#3a3a4a",
  [Color.RED]:     "#992222",
  [Color.GREEN]:   "#1e7a1e",
  [Color.BLUE]:    "#1545a8",
};

const COLOR_LABEL: Record<number, string> = {
  [Color.NOCOLOR]: "Tous",
  [Color.RED]:     "Rouge",
  [Color.GREEN]:   "Vert",
  [Color.BLUE]:    "Bleu",
};

let uiState: UIState;
let selectedSlot: { fi: number; ii: number; el: HTMLButtonElement } | null = null;

function renderFunctions(): void {
  const container = document.getElementById("functions-container") as HTMLDivElement;
  if (!container) return;
  container.innerHTML = "";

  uiState.puzzle.subs.forEach((size, fi) => {
    if (size === 0) return;
    const fKey = `F${fi + 1}` as keyof Program;
    const instrs = uiState.program[fKey];

    const row = document.createElement("div");
    row.className = "func-row";

    const label = document.createElement("span");
    label.className = "func-label";
    label.textContent = `F${fi + 1}`;
    row.appendChild(label);

    for (let ii = 0; ii < size; ii++) {
      const instr = instrs[ii] ?? { action: "VOID", color: Color.NOCOLOR };
      const btn = document.createElement("button");
      btn.className = "slot-btn" + (selectedSlot?.fi === fi && selectedSlot?.ii === ii ? " selected" : "");
      btn.style.background = instr.action !== "VOID" ? COLOR_BG[instr.color] : "#252530";
      btn.textContent = ACTION_SYMBOLS[instr.action] ?? "";
      btn.title = `F${fi + 1}[${ii + 1}]`;
      btn.addEventListener("click", () => openPalette(fi, ii, btn));
      row.appendChild(btn);
    }

    container.appendChild(row);
  });
}

// ─── Palette ───────────────────────────────────────────────────────────────────

const ALL_ACTIONS: (keyof typeof ACTION_SYMBOLS)[] = [
  "MOVE", "LEFT", "RIGHT", "TURN",
  "CALL_1", "CALL_2", "CALL_3", "CALL_4", "CALL_5",
];

const ALL_COLORS: Color[] = [Color.NOCOLOR, Color.RED, Color.GREEN, Color.BLUE];

function buildPalettePopup(): void {
  let pal = document.getElementById("palette-popup");
  if (pal) pal.remove();

  pal = document.createElement("div");
  pal.id = "palette-popup";
  pal.style.display = "none";

  const availableActions = ALL_ACTIONS.filter((a) => {
    if (!a.startsWith("CALL_")) return true;
    const fi = parseInt(a.slice(-1)) - 1;
    return uiState.puzzle.subs[fi] > 0;
  });

  ALL_COLORS.forEach((color) => {
    const row = document.createElement("div");
    row.className = "palette-row";

    availableActions.forEach((action) => {
      const btn = document.createElement("button");
      btn.className = "palette-btn";
      btn.style.background = COLOR_BG[color];
      btn.textContent = ACTION_SYMBOLS[action];
      btn.title = `${action} / ${COLOR_LABEL[color]}`;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        applyInstruction(action as InstrDef["action"], color);
      });
      row.appendChild(btn);
    });

    const clear = document.createElement("button");
    clear.className = "palette-btn clear-btn";
    clear.textContent = "✕";
    clear.title = "Effacer";
    clear.addEventListener("click", (e) => {
      e.stopPropagation();
      applyInstruction("VOID", Color.NOCOLOR);
    });
    row.appendChild(clear);
    pal!.appendChild(row);
  });

  document.body.appendChild(pal);
}

function openPalette(fi: number, ii: number, el: HTMLButtonElement): void {
  selectedSlot = { fi, ii, el };
  const pal = document.getElementById("palette-popup")!;
  const rect = el.getBoundingClientRect();
  pal.style.display = "flex";
  pal.style.flexDirection = "column";
  pal.style.position = "fixed";
  pal.style.left = `${rect.left}px`;
  pal.style.top  = `${rect.bottom + 4}px`;
  pal.style.zIndex = "1000";

  setTimeout(() => {
    document.addEventListener("click", closePaletteOutside);
  }, 0);
}

function closePaletteOutside(e: MouseEvent): void {
  const pal = document.getElementById("palette-popup");
  if (pal && !pal.contains(e.target as Node)) closePalette();
}

function closePalette(): void {
  const pal = document.getElementById("palette-popup");
  if (pal) pal.style.display = "none";
  selectedSlot = null;
  document.removeEventListener("click", closePaletteOutside);
}

function applyInstruction(action: InstrDef["action"], color: Color): void {
  if (!selectedSlot) return;
  const { fi, ii } = selectedSlot;
  const fKey = `F${fi + 1}` as keyof Program;
  uiState.program[fKey][ii] = { action, color };
  closePalette();
  renderFunctions();
}

// ─── Statut ────────────────────────────────────────────────────────────────────

function setStatus(msg: string, type: "info" | "ok" | "err" = "info"): void {
  const el = document.getElementById("status-msg");
  if (!el) return;
  el.textContent = msg;
  el.className = `status-${type}`;
}

// ─── Actions boutons ────────────────────────────────────────────────────────────

function doReset(): void {
  if (autoInterval !== null) { clearInterval(autoInterval); autoInterval = null; }
  uiState.gameState = null;
  uiState.history = [];
  uiState.status = "idle";
  uiState.steps = 0;
  setStatus("Programme réinitialisé.");
  renderBoard(uiState.puzzle, null);
  renderFunctions();
  updateRunBtn(false);
}

function doStepForward(): void {
  if (uiState.status === "won" || uiState.status === "lost") return;

  if (!uiState.gameState) {
    uiState.history = [];
    uiState.gameState = buildInitialState(uiState.puzzle, uiState.program);
    uiState.status = "running";
  }

  uiState.history.push(uiState.gameState);
  const result = stepOnce(uiState.gameState);

  if (result.kind === "ok") {
    uiState.gameState = result.state;
    uiState.steps++;
    setStatus(`Étape ${uiState.steps}`);
    renderBoard(uiState.puzzle, uiState.gameState);
  } else if (result.kind === "won") {
    uiState.status = "won";
    setStatus(`🎉 Puzzle résolu en ${uiState.steps} étapes !`, "ok");
    renderBoard(uiState.puzzle, uiState.history[uiState.history.length - 1]);
  } else {
    uiState.status = "lost";
    setStatus(`❌ ${result.reason}`, "err");
  }
}

function doStepBack(): void {
  if (uiState.history.length === 0) { setStatus("Pas d'historique."); return; }
  if (autoInterval !== null) { clearInterval(autoInterval); autoInterval = null; updateRunBtn(false); }
  uiState.gameState = uiState.history.pop()!;
  uiState.status = "running";
  uiState.steps = Math.max(0, uiState.steps - 1);
  setStatus(`← Retour — étape ${uiState.steps}`);
  renderBoard(uiState.puzzle, uiState.gameState);
}

let autoInterval: number | null = null;

function updateRunBtn(running: boolean): void {
  const btn = document.getElementById("btn-run") as HTMLButtonElement | null;
  if (!btn) return;
  btn.textContent = running ? "⏸" : "▶";
  btn.title = running ? "Pause" : "Lancer";
}

function doRunAll(): void {
  if (autoInterval !== null) {
    clearInterval(autoInterval); autoInterval = null;
    setStatus("⏸ Pause");
    updateRunBtn(false);
    return;
  }
  if (uiState.status === "won" || uiState.status === "lost") doReset();

  setStatus("▶ Exécution…");
  updateRunBtn(true);
  autoInterval = window.setInterval(() => {
    doStepForward();
    if (uiState.status === "won" || uiState.status === "lost") {
      clearInterval(autoInterval!); autoInterval = null;
      updateRunBtn(false);
    }
  }, 180);
}

// ─── Chargement des puzzles ─────────────────────────────────────────────────────

async function fetchPuzzles(): Promise<Puzzle[]> {
  const res = await fetch("/share/puzzles.json");
  return res.json();
}

function emptyProgram(puzzle: Puzzle): Program {
  const empty = () => ({ action: "VOID" as const, color: Color.NOCOLOR });
  return {
    F1: Array.from({ length: puzzle.subs[0] }, empty),
    F2: Array.from({ length: puzzle.subs[1] }, empty),
    F3: Array.from({ length: puzzle.subs[2] }, empty),
    F4: Array.from({ length: puzzle.subs[3] }, empty),
    F5: Array.from({ length: puzzle.subs[4] }, empty),
  };
}

function loadPuzzle(puzzle: Puzzle): void {
  if (autoInterval !== null) { clearInterval(autoInterval); autoInterval = null; }
  uiState = {
    puzzle,
    program: emptyProgram(puzzle),
    gameState: null,
    history: [],
    status: "idle",
    steps: 0,
  };

  const titleEl = document.getElementById("puzzle-title");
  const aboutEl = document.getElementById("puzzle-about");
  if (titleEl) titleEl.textContent = `#${puzzle.id} — ${puzzle.title}`;
  if (aboutEl) aboutEl.textContent = puzzle.about || "";

  buildPalettePopup();
  renderBoard(puzzle, null);
  renderFunctions();
  setStatus("Remplis les fonctions puis appuie sur ▶.");
  updateRunBtn(false);
}

// ─── Point d'entrée ─────────────────────────────────────────────────────────────

window.onload = async () => {
  const puzzles = await fetchPuzzles();

  const select = document.getElementById("puzzle-select") as HTMLSelectElement;
  puzzles.forEach((p, i) => {
    const opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = `#${p.id} — ${p.title}`;
    select.appendChild(opt);
  });

  select.addEventListener("change", () => {
    const idx = parseInt(select.value);
    if (!isNaN(idx)) loadPuzzle(puzzles[idx]);
  });

  document.getElementById("btn-run")      ?.addEventListener("click", doRunAll);
  document.getElementById("btn-step-fwd") ?.addEventListener("click", doStepForward);
  document.getElementById("btn-step-bwd") ?.addEventListener("click", doStepBack);
  document.getElementById("btn-reset")    ?.addEventListener("click", doReset);

  if (puzzles.length > 0) {
    select.value = "0";
    loadPuzzle(puzzles[0]);
  }
};