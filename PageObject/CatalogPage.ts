import { expect } from '@playwright/test';
import type { Locator, Page } from 'playwright-core';
import { BasePage } from './BasePage';

/**
 * CatalogPage - Page Object da home/catálogo de produtos
 * Site demo: https://practicesoftwaretesting.com
 */
export class CatalogPage extends BasePage {
  readonly campoBusca: Locator;
  readonly botaoBuscar: Locator;
  readonly botaoResetBusca: Locator;
  readonly legendaBusca: Locator;
  readonly termoBusca: Locator;
  readonly semResultados: Locator;
  readonly cardsProdutos: Locator;

  constructor(page: Page) {
    super(page);

    this.campoBusca = page.getByTestId('search-query');
    this.botaoBuscar = page.getByTestId('search-submit');
    this.botaoResetBusca = page.getByTestId('search-reset');
    this.legendaBusca = page.getByTestId('search-caption');
    this.termoBusca = page.getByTestId('search-term');
    this.semResultados = page.getByTestId('no-results');
    this.cardsProdutos = page.locator('a[data-test^="product-"][href*="/product/"]');
  }

  async navegarParaCatalogo() {
    await this.navegarPara('/');
    await this.aguardarElemento(this.campoBusca);
  }

  async buscarProduto(termo: string) {
    await this.preencherCampo(this.campoBusca, termo);
    await this.clicar(this.botaoBuscar);
  }

  async abrirProdutoPeloNome(nomeProduto: string) {
    const cardProduto = this.cardsProdutos.filter({ hasText: nomeProduto }).first();
    await this.clicar(cardProduto);
  }

  async verificarResultadosDaBusca(termo: string) {
    await this.verificarElementoVisivel(this.legendaBusca);
    await expect(this.termoBusca).toContainText(termo, { timeout: 15_000 });
    await expect(this.cardsProdutos.first()).toBeVisible({ timeout: 15_000 });
  }

  async verificarProdutoListado(nomeProduto: string) {
    await expect(this.cardsProdutos.filter({ hasText: nomeProduto }).first()).toBeVisible({ timeout: 15_000 });
  }

  async verificarMensagemSemResultados() {
    await expect(this.semResultados).toBeVisible({ timeout: 15_000 });
  }
}
