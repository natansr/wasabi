# Wasabi

Workflow de Análise Sistemática e Bibliométrica Integrada.

O Wasabi é uma aplicação web livre e bilíngue para revisões da literatura, análises bibliométricas, mapeamento científico e aplicação computacional do TEMAC — Teoria do Enfoque Meta-Analítico Consolidado.

## Funcionalidades

- fluxo TEMAC em três etapas;
- projetos armazenados no navegador;
- importação de arquivos CSV exportados pelo Scopus;
- mapeamento de campos, normalização e revisão de duplicatas;
- indicadores bibliométricos, gráficos e tabela do corpus;
- redes de coautoria, coocorrência, acoplamento bibliográfico, cocitação e citações internas;
- comunidades Louvain, layout ForceAtlas2, densidade e overlays;
- anotações vinculadas às visualizações e clusters;
- exportação de gráficos e redes em formatos de imagem e dados;
- relatório final em TXT, Markdown e PDF;
- backup e compartilhamento de projetos em `.wasabi.json`;
- interface em português e inglês, tema claro ou escuro e funcionamento offline após o primeiro acesso.

Esta versão aceita arquivos CSV do Scopus. O suporte a outras bases está previsto para versões posteriores.

## Privacidade

Os arquivos importados não são enviados para servidores externos. A leitura, o armazenamento e as análises acontecem no navegador. Exporte o arquivo `.wasabi.json` para manter um backup ou compartilhar o projeto.

## Desenvolvimento

Requer Node.js 20 ou superior.

```bash
npm install
npm run dev
```

Comandos disponíveis:

```bash
npm run lint
npm test
npm run test:e2e
npm run build
npm run preview
```

Os testes de interface usam Playwright. Para instalar o Chromium utilizado por eles:

```bash
npx playwright install chromium
```

## Publicação

O projeto é uma aplicação estática preparada para GitHub Pages. O workflow em `.github/workflows/deploy-pages.yml` executa os testes, gera o build e publica o conteúdo de `dist/` a partir da branch `main`.

## English

Wasabi is a free, bilingual web application for literature reviews, bibliometric analysis, scientific mapping, and the computational application of TEMAC — Consolidated Meta-Analytical Approach Theory.

The current version imports Scopus CSV files, processes and stores projects in the browser, provides bibliometric indicators and networks, supports visualization notes, and exports final reports as TXT, Markdown, or PDF. Support for additional databases is planned for later versions.

Imported files are not sent to external servers. Export the `.wasabi.json` project file to keep a backup or share the project.

## License

MIT. See [LICENSE](LICENSE).

## Citação

Ao final, se usou o Wasabi, favor citar: Em breve teremos a citação.
