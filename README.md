# נורית כנורי – שירותי השמה בביטוח

Static website for [nuritkinory.co.il](https://nuritkinory.co.il).

- `main` – source of truth. All editing happens here, inside `dist/`.
- `gh-pages` – the published branch. Never edit it directly; `npm run deploy` overwrites it from `dist/`.

## Structure

```
dist/
  index.html          Home
  about.html          About
  jobs.html           Job listings (rendered from jobs.js)
  contact.html        Contact + mail form
  accessibility.html  Accessibility statement (required by Israeli law)
  404.html            Not-found page (GitHub Pages serves it automatically)
  style.css           All styling
  script.js           Nav, accessibility widget, jobs filtering, contact form
  jobs.js             THE JOB LIST – edit this to add/remove jobs
  images/             logo.png, favicon.png, hero.jpg
  CNAME               Custom domain (must stay here so deploys keep the domain)
  robots.txt, sitemap.xml
```

There is no build step. Open `dist/index.html` in a browser, or run:

```
npm install
npm start          # serves dist/ on http://localhost:8080
```

## Updating jobs

Edit `dist/jobs.js`. Each job is an object:

```js
{
  id: 11,                          // unique number
  title: "שם המשרה",
  category: "underwriting",        // one of the keys in NK_CATEGORIES
  location: "תל אביב יפו, רמת גן",
  summary: "תיאור קצר.",
  requirements: ["דרישה 1", "דרישה 2"],
  hybrid: false,                   // true shows an "hybrid" tag
  featured: true                   // true shows the job on the home page (first 3)
}
```

Categories (and their Hebrew labels) are defined at the top of the same file. Filter chips on the jobs page are generated automatically from the categories in use.

## Contact details

Phone and e-mail addresses appear in the header/footer of every page and in `script.js` (`CV_EMAIL`, `INFO_EMAIL`). Search-and-replace across `dist/` when they change.

## Deploying

```
npm run deploy
```

This pushes the contents of `dist/` (including `CNAME` and `.nojekyll`) to the `gh-pages` branch.
