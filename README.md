# ExtraSheet

ExtraSheet is a simple, fast educational website where students can search **Class 10 Previous Year Question Papers** for the **CBSE** and **UP Board** boards, from **2022 to 2026**.

Built with plain **HTML5, CSS3, and vanilla JavaScript** — no frameworks, no build tools, no backend.

---

## Project overview

- **Purpose:** Let a student pick a board, subject, and year, and instantly find a link to the matching past paper.
- **Scope:** Class 10 only. Boards: CBSE and UP Board. Exam type: Regular only.
- **Data:** All paper metadata lives in `data/papers.json`. The site fetches this file at runtime with `fetch()`.
- **PDF hosting:** PDFs are **not** stored in this project. They are hosted separately (recommended: GitHub Pages), and `papers.json` stores a direct URL to each PDF.

---

## Folder structure

```
extrasheet/
├── index.html         # Homepage: hero + search card + results
├── style.css           # All styling (CSS variables, layout, animations)
├── script.js            # Fetches papers.json, handles search + rendering
├── data/
│   └── papers.json      # Paper records (board, subject, year, type, pdf)
├── assets/
│   ├── logo.png          # Site logo
│   └── favicon.png       # Browser tab icon
└── README.md
```

---

## Features

- Clean hero section with a modern search card (Board, Subject, Year, Exam Type).
- Exam Type is fixed to **Regular** and disabled, since it is the only supported type.
- Client-side search against `data/papers.json` — no server or API required.
- Result card shows Status, Board, Class, Subject, Year, and two actions:
  - **Read PDF** — opens the PDF in a new tab.
  - **Download PDF** — downloads the PDF directly.
- "No paper found for the selected criteria." message when there is no match.
- Fully responsive (desktop, tablet, mobile), keyboard-accessible, with visible focus states.
- SEO tags: title, meta description, meta keywords, Open Graph, Twitter Card, favicon.
- CSS-only animations (fade-in, hover states) — no animation libraries.

---

## How to run locally

Because the site uses `fetch()` to load `data/papers.json`, it must be served over HTTP (not opened directly as a `file://` URL).

Any of these work:

```bash
# Python
python3 -m http.server 5500

# Node (if you have npx available)
npx serve .
```

Then open `http://localhost:5500` (or whatever port your server prints).

---

## How to deploy on Vercel

1. Push this `extrasheet/` folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) and click **Add New → Project**.
3. Import the GitHub repository.
4. Framework preset: choose **Other** (this is a static site — no build step is required).
5. Leave **Build Command** empty and **Output Directory** as `.` (the project root).
6. Click **Deploy**.

Vercel will serve `index.html`, `style.css`, `script.js`, and the `data/` and `assets/` folders as static files automatically.

---

## How to host PDFs on GitHub Pages

ExtraSheet does not store any PDFs itself — it only links to them. A simple way to host the PDFs for free:

1. Create a new GitHub repository, for example `extrasheet-papers`.
2. Organize your PDFs by board and subject, for example:

   ```
   extrasheet-papers/
   ├── cbse/
   │   ├── science/
   │   │   ├── 2022.pdf
   │   │   └── 2023.pdf
   │   └── mathematics-basic/
   │       └── 2022.pdf
   └── up-board/
       └── science/
           └── 2022.pdf
   ```

3. In the repository settings, enable **GitHub Pages** (Settings → Pages → Deploy from branch → `main` / root).
4. Your PDFs will now be available at URLs like:

   ```
   https://YOUR_USERNAME.github.io/extrasheet-papers/cbse/science/2022.pdf
   ```

5. Use these URLs in the `pdf` field of `data/papers.json`.

---

## How to add new papers

Open `data/papers.json` and add a new entry to the array. Each record uses this shape:

```json
{
  "board": "CBSE",
  "subject": "Science",
  "year": "2026",
  "type": "Regular",
  "pdf": "https://YOUR_USERNAME.github.io/extrasheet-papers/cbse/science/2026.pdf"
}
```

**Field rules:**

- `board` — must exactly match `"CBSE"` or `"UP Board"`.
- `subject` — one of: `English Literature`, `Hindi A`, `Hindi B`, `Mathematics Basic`, `Mathematics Standard`, `Science`, `Social Science`, `Artificial Intelligence`.
- `year` — one of: `2022`, `2023`, `2024`, `2025`, `2026`.
- `type` — always `"Regular"`.
- `pdf` — a direct, publicly accessible URL to the PDF file.

No code changes are needed — the site reads `papers.json` at runtime, so adding a new paper is just adding a new JSON object and redeploying (or, on Vercel, pushing to your connected branch).

---

## Design

| Token | Value |
|---|---|
| Primary color | `#2563EB` |
| Background | White |
| Font | Poppins |
| Corner radius | 16px |
| Shadows | Soft, layered |

The site uses a light "ruled notebook page" texture in the hero and a perforated-edge, stamped "Available" result card — small visual nods to the exam-paper subject matter, built entirely with CSS (no images).
