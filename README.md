# Robozzle — Functional Programming Engine in TypeScript

A from-scratch implementation of [Robozzle](https://en.wikipedia.org/wiki/RoboZZle), a puzzle game where you program a robot's movement using a limited set of reusable, conditional functions. Built as a strict exercise in **functional programming**: immutable state, persistent data structures, and no classes.

Built for the Functional Programming course (S6) at **ENSEIRB-MATMECA — Bordeaux INP**, by Ilan Vargas, Mohsine Hssassa, and Youssef Dassouli.

## What it does

The robot moves across a colored grid, collecting stars, by executing a program made of up to 5 functions (`arrayFunct` in [`src/code.ts`](src/code.ts)). Functions can call each other and branch on the color of the square the robot is standing on — giving you a tiny, recursive, conditional instruction set to solve each puzzle. A browser-based visualizer lets you step through, rewind, or auto-play the execution.

## Why it's interesting

- **No mutation, no classes.** Every action (`moveForward`, `turnRight`, `turnLeft`, function calls) is a pure function `State -> State`. The board, robot, and call stack are all immutable; `removeStar`, `move2square`, etc. always return new values ([`src/board.ts`](src/board.ts), [`src/robot.ts`](src/robot.ts)).
- **Hand-rolled persistent stack.** [`src/stack.ts`](src/stack.ts) implements a cons-list (`nil` / `cons` / `head` / `tail`) from scratch rather than reaching for an array — a deliberate functional-data-structures exercise, also used to track recursion depth and guard against infinite loops (`isOverStack`).
- **Program-as-data interpreter.** [`src/gameState.ts`](src/gameState.ts) compiles the 5 user-defined functions into actions pushed onto a stack and steps through them one at a time, which is what powers the step/back/play controls in the UI.
- **Time travel for free.** Because every state transition produces a brand-new, immutable `State`, "undo" ([`back`](src/main.ts)) is just keeping a stack of past states rather than writing inverse operations.
- **Strict TypeScript throughout** — `strict`, `noImplicitAny`, `strictNullChecks`, etc. are all on (see [`tsconfig.json`](tsconfig.json)).

## Architecture

```
src/
├── puzzle.ts     # Puzzle type, directions, colors, board dimensions
├── square.ts     # A single board tile (color, star, position)
├── board.ts      # The grid: construction from puzzle data, movement, star removal
├── robot.ts      # Robot position/direction + its pure movement actions
├── stack.ts      # Persistent cons-list used as the call stack / history
├── gameState.ts  # Ties robot+board+stack into a Game State and the function-call interpreter
├── code.ts       # Where you write your solution (puzzle id + the 5 functions)
├── main.ts       # Game loop glue: init/step/back/restart, exposed to the UI
└── index.ts      # DOM wiring for the interactive HTML visualizer
```

## Running it

```bash
npm install
make build          # compile TypeScript
make serve           # start the interactive visualizer at http://localhost:1234
```

Write your solution in `src/code.ts` (pick a `puzzle_id`, fill in up to 5 functions), then `make build && make serve` to watch it run.

| Command       | Description                                   |
|---------------|------------------------------------------------|
| `make build`  | Compile the project                            |
| `make test`   | Run the Jest test suite with coverage          |
| `make serve`  | Launch the interactive browser visualizer      |
| `make run`    | Run the robot logic as a TUI test              |
| `make eslint` | Lint and auto-fix source code                  |
| `make clean`  | Remove compiled output                         |

## Tests

357 lines of Jest tests cover the board, robot movement, square, and stack modules (`test/`), run with `make test`.

## Tech

TypeScript (strict mode) · Jest + ts-jest · Parcel (bundling the visualizer) · ESLint
