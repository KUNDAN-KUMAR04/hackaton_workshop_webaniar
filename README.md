# Hackathon · Workshop · Webinar Hub

A single, professional home page for everything related to the event: schedule, speakers, slides, code, and links — all in one place, all editable through one JSON file.

**No rebuild, no code changes to add content.** Open `data/content.json`, add or edit an entry, save, and the site updates.

## What's in this repo

```
.
├── index.html          # the hub page
├── style.css           # visual design
├── app.js              # reads content.json and renders the page
├── data/
│   └── content.json    # <-- edit this to change what's on the site
├── slides/              # drop slide decks / PDFs here
├── code/                # drop starter code / repos here
└── resources/           # any other files (handouts, datasets, etc.)
```

## How to add or update content

Everything visible on the page comes from `data/content.json`. Its shape is:

```json
{
  "event": {
    "title": "Your event name",
    "tagline": "One line describing it",
    "description": "A sentence or two of detail",
    "date": "Sept 20, 2026",
    "location": "Online / venue name"
  },
  "sections": [
    {
      "id": "schedule",
      "type": "schedule",
      "title": "Schedule",
      "items": [
        { "time": "Day 1 · 10:00", "title": "Opening", "description": "..." }
      ]
    }
  ]
}
```

- **`event`** — powers the header/hero at the top of the page.
- **`sections`** — an ordered list of content blocks. Each one becomes a section on the page, in the order you list them.

### Built-in section types (get a custom layout)

| `type`      | Layout               | Item fields |
|-------------|-----------------------|-------------|
| `schedule`  | Vertical timeline      | `time`, `title`, `description` |
| `speakers`  | Card grid              | `name`, `role`, `bio` |
| `resources` | Card grid with a tag + link | `title`, `description`, `url`, `tag` |
| `links`     | Simple list             | `label`, `url` |

### Anything else — the "other" option

Use **any `type` string you like** (e.g. `"faq"`, `"sponsors"`, `"prizes"`) and it will still render automatically, as a card grid built from whatever fields you give each item. You never need to touch `app.js` — new categories just show up.

Example of a custom section:

```json
{
  "id": "prizes",
  "type": "prizes",
  "title": "Prizes",
  "items": [
    { "place": "1st", "reward": "$500 + mentorship" },
    { "place": "2nd", "reward": "$250" }
  ]
}
```

## When a link goes bad

You now have two layers of protection:

1. **`404.html`** — GitHub Pages automatically serves this for any URL on your site that doesn't resolve (a mistyped link, a page that moved, an old bookmark). This is native GitHub Pages behavior — no configuration needed. It's already set up with the correct paths for this repo (`.../hackaton_workshop_webaniar/`). It shows a friendly "page not found" message with a button back to the hub and a "report this link" email.

2. **`go.html`** — handles the other direction: links from your hub *out* to external sites (registration forms, Google Docs, etc.) that might expire.

Together: your own broken links → `404.html`. Links you point *at* that later go dead → `go.html`.

Every external (`http`/`https`) link on the hub is automatically routed through `go.html` first — a small page on *your* site that says "you're leaving the hub, here's where you're headed," with a **Continue** button and a **"let the organizers know"** contact link (built from `event.contact_email` in `content.json`). If the destination is dead, the visitor finds out on your branded page and can email you, instead of hitting an unbranded error somewhere else.

This is a courtesy step, not a live checker — browsers can't verify a cross-origin link is alive without hitting it, so `go.html` doesn't try to guess; it just gives people a safe, clear off-ramp either way.

Files you host yourself (anything under `slides/`, `code/`, `resources/`) skip this step and link straight through, since you control whether those exist.

Set your contact address once, at the top of `content.json`:
```json
"event": { "contact_email": "you@example.com" }
```

## Publishing it as a live site (GitHub Pages)

1. Go to the repo's **Settings → Pages**.
2. Under "Build and deployment", set **Source** to `Deploy from a branch`.
3. Pick the `main` branch and `/ (root)` folder, then save.
4. GitHub will publish the hub at `https://kundan-kumar04.github.io/hackaton_workshop_webaniar/`.

Every time you push a change to `data/content.json`, the live page updates within a minute or two — no other steps required.

## Uploading files (slides, code, resources)

Drop files into the matching folder and reference them from `content.json`:

- Slides → `slides/your-deck.pdf` → `"url": "slides/your-deck.pdf"`
- Starter code → `code/your-folder/` → `"url": "code/your-folder/"`
- Anything else → `resources/`

## Local preview

No build step needed — it's plain HTML/CSS/JS. To preview before pushing:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser.
