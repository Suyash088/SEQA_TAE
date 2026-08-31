# ⚡ SEQA Process Wiki & Engineering Knowledge Base

An interactive, searchable Software Engineering Process Knowledge Base organizing Organizational Process Assets (OPAs), SDLC templates, quality checklists, governance guidelines, and decision records.

---

## 🌟 Features

- **Interactive Process Knowledge Base**: Comprehensive guidelines for SDLC phases (Requirement, Architecture, Development, Testing, CI/CD, Deployment).
- **Template Studio**: Copy and download standard templates (ADRs, PR Guidelines, DoD/DoR, Test Plans, Post-Mortems, Release Runbooks).
- **Quality Gate Audit & Checklists**: Interactive sign-off checklists with instant Markdown audit certificate generation.
- **Fast Search & Command Palette**: Instant full-text search with `⌘K` / `Ctrl+K` shortcut support.
- **Dark / Light Theme**: Modern UI with system-aware persistent theme switching.
- **Zero-Dependency Architecture**: Pure HTML5, CSS3, and modern Vanilla JavaScript — ultra-fast and lightweight.

---

## 📁 Project Structure

```text
SEQA_TAE/
├── index.html          # Main HTML entrypoint & UI layout
├── favicon.svg         # Modern vector favicon
├── .gitignore          # Git ignore file for OS/temp files
├── render.yaml         # Render deployment configuration blueprint
├── README.md           # Documentation
├── css/
│   └── styles.css      # Core styles, design tokens, light/dark themes
└── js/
    ├── app.js          # Main application logic & event handlers
    ├── data.js         # Process assets, templates, and checklists data
    └── templates.js    # UI rendering engine and Markdown parser
```

---

## 🚀 Running Locally

You can run this project locally without any installation or build steps:

### Option 1: Open Directly
Simply double-click [`index.html`](file:///Users/suyashmeshram/SEQA_TAE/index.html) in your browser.

### Option 2: Using a local web server (Python or Node)
```bash
# Python 3
python3 -m http.server 8000

# Or using Node npx
npx serve .
```
Then open `http://localhost:8000` in your browser.

---

## 🌐 Deploy to Render

This project is pre-configured for **Render Static Sites**:

1. Push this repository to **GitHub**.
2. Log into [Render Dashboard](https://dashboard.render.com).
3. Click **New +** → **Static Site**.
4. Select your repository.
5. Set:
   - **Build Command**: *(Leave empty)*
   - **Publish Directory**: `.`
6. Click **Create Static Site**.
