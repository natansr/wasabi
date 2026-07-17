import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('wasabi.language')) {
      localStorage.setItem('wasabi.language', 'pt-BR');
    }
  });
  await page.goto('/');
});

test('apresenta o início e navega para um novo projeto', async ({ page }) => {
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  await expect(page.getByRole('heading', { level: 1, name: 'Wasabi' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Wasabi', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /GitHub: natansr\/wasabi/ })).toHaveAttribute('href', 'https://github.com/natansr/wasabi');
  await expect(page.getByRole('link', { name: /InfoKnow\/UnB/ })).toHaveAttribute('href', 'http://dgp.cnpq.br/dgp/espelhogrupo/7367577310347657');
  await expect(page.getByRole('heading', { name: 'Como começar' })).toBeVisible();
  await page.getByRole('link', { name: 'Novo projeto' }).click();
  await expect(page).toHaveURL(/#\/projects\/new$/);
  await expect(page.getByRole('heading', { name: 'Novo projeto de revisão' })).toBeVisible();
  await expect(page.getByRole('radio', { name: 'Detectar pelo CSV' })).toBeChecked();
  await expect(page.getByLabel('Ano inicial')).toBeDisabled();
});

test('troca o idioma e mantém a preferência', async ({ page }) => {
  await page.getByRole('combobox', { name: 'Idioma' }).selectOption('en-US');
  await expect(page.getByRole('link', { name: 'New project' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('combobox', { name: 'Language' })).toHaveValue('en-US');
});

test('não apresenta violações automáticas de acessibilidade', async ({ page }) => {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('mantém o conteúdo dentro da largura da tela', async ({ page }) => {
  const dimensions = await page.evaluate(() => ({
    contentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
  }));
  expect(dimensions.contentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
});

test('exporta gráficos e mapas durante o fluxo de análise', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile-chromium', 'A exportação científica em alta resolução é validada no perfil desktop.');
  await page.getByRole('button', { name: 'Carregar dados de exemplo' }).click();
  await expect(page.getByRole('heading', { name: /Exemplo:/ })).toBeVisible();

  await page.getByRole('button', { name: /2\. Apresentação/ }).click();
  await page.getByText('Dúvidas? Veja como obter o CSV no Scopus').click();
  await expect(page.getByRole('img', { name: 'Menu Export do Scopus com a opção CSV' })).toBeVisible();
  await expect(page.getByText(/Esta versão do Wasabi trabalha somente/)).toBeVisible();
  await expect(page.locator('a[href^="https://doi.org/"]').first()).toBeVisible();
  const chartPng = page.getByRole('button', { name: 'Baixar PNG' }).first();
  await expect(chartPng).toBeVisible();
  const chartDownload = page.waitForEvent('download');
  await chartPng.click();
  const downloadedChart = await chartDownload;
  await expect(downloadedChart.suggestedFilename()).toMatch(/\.png$/);
  const chartPath = await downloadedChart.path();
  expect(chartPath).not.toBeNull();
  const chartDataUrl = `data:image/png;base64,${(await readFile(chartPath!)).toString('base64')}`;
  const coloredPixels = await page.evaluate(async (source) => {
    const image = new Image();
    image.src = source;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d')!;
    context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, image.width, image.height).data;
    let count = 0;
    for (let index = 0; index < pixels.length; index += 16) {
      const red = pixels[index], green = pixels[index + 1], blue = pixels[index + 2];
      if (green > red * 1.18 && green > blue * 1.08 && green > 70) count += 1;
    }
    return count;
  }, chartDataUrl);
  expect(coloredPixels).toBeGreaterThan(100);

  await page.getByRole('button', { name: /3\. Detalhamento/ }).click();
  await page.getByRole('button', { name: 'Gerar rede' }).click();
  await expect(page.getByRole('group', { name: 'Visualização interativa da rede bibliométrica' })).toBeVisible();
  await page.getByLabel('Modo visual').selectOption('density');
  await expect(page.getByRole('img', { name: 'Mapa de densidade da rede bibliométrica' })).toBeVisible();
  await expect(page.getByText('Visualização: Densidade')).toBeVisible();
  await page.getByLabel('Anotação desta visualização').fill('A densidade destaca o núcleo temático do corpus.');
  await page.getByRole('heading', { name: 'Exportar mapa e dados da rede' }).click();
  const networkDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Imagem PNG' }).click();
  await expect((await networkDownload).suggestedFilename()).toMatch(/\.png$/);

  for (const format of ['TXT', 'Markdown', 'PDF']) {
    const reportDownload = page.waitForEvent('download');
    await page.getByRole('button', { name: `Exportar ${format}` }).click();
    await expect((await reportDownload).suggestedFilename()).toMatch(new RegExp(`\\.${format === 'Markdown' ? 'md' : format.toLowerCase()}$`));
  }
});
