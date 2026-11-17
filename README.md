# Service Hours Hub — ACL UI/UX Lab (V2)

A **standalone React + Vite demo** used for one session of the **UI/UX Rescue Challenge**.
The app works, but its interface was not designed around what students actually need to do. Your job is to **redesign the user experience** so the session's user scenario is easy to complete — **without removing or weakening any existing feature**.

The app runs entirely in the browser. It uses realistic example records saved in `localStorage` and does **not** connect to MongoDB or any API.

---

## The task

### 1. Understand the user scenario

> A student is **choosing a community service program**, wants to **understand how much time and effort previous volunteers put in (and what they said about it)**, and then **logs their own volunteering hours for a different program**.

Walk through this scenario in the current app before changing anything. Note every point where the student hesitates, gets lost, has to guess, or does unnecessary work.

### 2. Redesign the interface

Improve the layout, navigation, wording, visual hierarchy, forms and feedback so the scenario above feels clear and quick. You may restructure components, styles and copy as much as you need.

### 3. Keep every existing feature working

A redesign that drops or breaks functionality does not count as a rescue. The following must still work after your changes:

| Area | What must keep working |
| --- | --- |
| **Browse entries** | List all hour entries with program, hours, reflection, volunteer name and an edit action for your own entries. |
| **Search & filter** | Search by program code, reflection text or volunteer name; filter by number of hours. |
| **Overview stats** | Total entries, average hours per entry, number of programs with activity, hours distribution (1–8). |
| **Program check** | Enter a program code to see its average hours per entry, number of entries and total hours. |
| **Program details page** | Clicking a program code opens a separate, **shareable** page (`#/programs/<CODE>`) with the program name, partner organisation, short description, the program team for **2024/25** and **2025/26** (faculty supervisors and student coordinators), and that program's logged entries. |
| **Log hours** | Create an entry with a program code, a number of hours and an optional reflection. |
| **Edit an entry** | Edit **only your own** entries (entries owned by `You`). |
| **Validation rules** | Program code is required; hours must be a **whole number from 1 to 8**; a user can log **only one entry per program**. |
| **Persistence & reset** | Changes are saved in `localStorage`; **Reset data** restores the example records. |

---

## Functional brief

Users browse volunteering entries and program summaries. Program codes in the activity feed open a separate, shareable program-details page showing the program name, partner organisation, short description, team for 2024/25 and 2025/26, and its logged entries. A volunteer may log one entry per program and edit only their own entries. Hours must be integers 1–8.

All staff names, partners and program descriptions are **fictional sample data**, not real university records.

### Entry fields

| Field | Label | Rule |
| --- | --- | --- |
| `programCode` | Program code | Required text (stored in upper case) |
| `hours` | Hours | Whole number 1 to 8 |
| `reflection` | Reflection | Optional |

Each stored entry also carries `id`, `owner` (`'you'` or `'other'`), `name` and `date`. You can assume the currently signed-in user is **`You`**.

### Example programs

| Code | Name |
| --- | --- |
| ENV110 | Campus Green Team |
| EDU210 | Peer Tutoring Circle |
| HLT150 | Blood Drive Crew |
| COM305 | Community Kitchen |
| TEC220 | Digital Skills for Seniors |

A program code that is not in the directory still works, but its details page shows a "Program details not yet added" placeholder.

---

## Run the project

Requires [Node.js](https://nodejs.org/) 18 or later.

```bash
npm install
npm run dev
```

The terminal prints **one local URL** (usually `http://localhost:5173/`). Open it in your normal browser — the dev server does **not** open a browser automatically. Press `Ctrl+C` to stop it.

Other scripts:

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

---

## Project structure

```
.
├── index.html          # HTML entry point
├── scripts/dev.mjs     # Starts the Vite dev server and prints a single URL
├── src/
│   ├── main.jsx        # Mounts <App /> into #root
│   ├── App.jsx         # All UI, state, routing, sample data and validation
│   └── styles.css      # All styling
└── package.json
```

Key things inside `src/App.jsx`:

- `PROGRAMS` — program names, partners, descriptions and team history.
- `seed` — the example entries restored by **Reset data**.
- `KEY` — the `localStorage` key where entries are saved.
- `readRoute` / `openProgram` — hash-based routing for the program details page.
- `save` — form validation (required code, 1–8 hours, one entry per program).

> Tip: if your changes to the data shape seem not to apply, click **Reset data** or clear the `acl-service-hours-v1` entry in your browser's `localStorage`.
