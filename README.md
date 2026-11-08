# Renwel

Static site for Renwel home services — Connecticut.

## Stack

Plain HTML/CSS/JS. No build step, no dependencies. Deploy as-is.

## Structure

```
├── index.html
├── about.html
├── services.html
├── repairs.html
├── installations.html
├── furniture-assembly.html
├── home-maintenance.html
├── how-it-works.html
├── quote.html
├── vercel.json
└── assets/
    ├── css/
    │   ├── style.css        # design system + embedded fonts
    │   └── animations.css   # micro-animations
    ├── js/
    │   ├── main.js          # service selection, mobile menu, quote form
    │   └── animations.js    # scroll-reveal, parallax, page transitions
    └── images/
        ├── hero.webp
        ├── repairs.webp
        ├── installations.webp
        ├── furniture.webp
        ├── maintenance.webp
        └── renwel-logo.png
```

## Deploy to Vercel

1. Push this folder to a GitHub repository
2. Import the repository at vercel.com
3. No build command needed — Output Directory: `.` (root)

## Local preview

```bash
npx serve .
# or
python3 -m http.server 8080
```
