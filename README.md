<p align="center">
  <img src="public/wasabi-logo.png" alt="Wasabi" width="420">
</p>

# Wasabi

Workflow for Systematic and Bibliometric Integrated Analysis (*Workflow de Análise SistemáticA e Bibliométrica Integrada*).

Wasabi is a web application designed to support literature reviews, bibliometric analysis, scientific mapping, and the computational application of [TEMAC](https://www.pesquisatemac.com) — Consolidated Meta-Analytical Approach Theory (*Teoria do Enfoque Meta-Analítico Consolidado*).

[Open Wasabi](https://natansr.github.io/wasabi/)

## Features

- a three-stage TEMAC workflow;
- projects stored in the browser;
- import of CSV files exported by Scopus;
- field mapping, normalization, and duplicate review;
- bibliometric indicators, charts, and a searchable corpus table;
- co-authorship, keyword co-occurrence, bibliographic coupling, co-citation, and internal citation networks;
- Louvain communities, ForceAtlas2 layout, density maps, and overlays;
- notes linked to visualizations and clusters;
- chart and network exports in image and data formats;
- final reports in TXT, Markdown, and PDF;
- project backup and sharing through `.wasabi.json` files;
- Portuguese and English interfaces, light and dark themes, and offline use after the first visit.

The current version accepts Scopus CSV files. Support for additional databases is planned for future releases.

## Privacy

Imported files are not sent to external servers. Reading, storage, and analysis take place in the browser. Export the `.wasabi.json` project file to keep a backup or share the project.

## Development

Node.js 20 or newer is required.

```bash
npm install
npm run dev
```

Available commands:

```bash
npm run lint
npm test
npm run test:e2e
npm run build
npm run preview
```

The interface tests use Playwright. Install its Chromium browser with:

```bash
npx playwright install chromium
```

## License

Wasabi is released under the MIT License. See [LICENSE](LICENSE).

## Citation

If you use Wasabi, please cite it. Citation details will be available soon.
