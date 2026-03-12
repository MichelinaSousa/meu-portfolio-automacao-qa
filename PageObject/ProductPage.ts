import { expect } from '@playwright/test';
import type { Locator, Page } from 'playwright-core';
import { BasePage } from './BasePage';

/**
 * ProductPage - Page Object da página de detalhe do produto
 * Site demo: https://practicesoftwaretesting.com
 */
export class ProductPage extends BasePage {
  readonly tituloProduto: Locator;
  readonly descricaoProduto: Locator;
  readonly campoQuantidade: Locator;
  readonly botaoAumentarQuantidade: Locator;
  readonly botaoDiminuirQuantidade: Locator;
  readonly botaoAdicionarCarrinho: Locator;
  readonly botaoAdicionarFavoritos: Locator;
  readonly navCarrinho: Locator;
  readonly badgeCarrinho: Locator;
  readonly confirmacaoCarrinho: Locator;

  constructor(page: Page) {
    super(page);

    this.tituloProduto = page.getByRole('heading', { level: 1 });
    this.descricaoProduto = page.getByTestId('product-description');
    this.campoQuantidade = page.getByTestId('quantity');
    this.botaoAumentarQuantidade = page.getByTestId('increase-quantity');
    this.botaoDiminuirQuantidade = page.getByTestId('decrease-quantity');
    this.botaoAdicionarCarrinho = page.getByTestId('add-to-cart');
    this.botaoAdicionarFavoritos = page.getByTestId('add-to-favorites');
    this.navCarrinho = page.getByTestId('nav-cart');
    this.badgeCarrinho = page.getByTestId('cart-quantity');
    this.confirmacaoCarrinho = page.getByText('Product added to shopping cart.');
  }

  async verificarDetalhesDoProduto(nomeProduto: string) {
    await expect(this.tituloProduto).toContainText(nomeProduto, { timeout: 15_000 });
    await expect(this.descricaoProduto).toBeVisible({ timeout: 15_000 });
    await expect(this.botaoAdicionarCarrinho).toBeVisible({ timeout: 15_000 });
  }

  async definirQuantidade(quantidade: number) {
    await this.preencherCampo(this.campoQuantidade, String(quantidade));
    await this.campoQuantidade.press('Tab');
  }

  async adicionarAoCarrinho(quantidade = 1) {
    await this.definirQuantidade(quantidade);
    await this.clicar(this.botaoAdicionarCarrinho);
  }

  async verificarMensagemProdutoAdicionado() {
    await expect(this.confirmacaoCarrinho).toBeVisible({ timeout: 15_000 });
  }

  async verificarBadgeCarrinhoComQuantidade(quantidadeEsperada: number) {
    await expect(this.badgeCarrinho).toContainText(String(quantidadeEsperada), { timeout: 15_000 });
  }

  async abrirCarrinhoPeloHeader() {
    await this.clicar(this.navCarrinho);
    await this.aguardarURL('/checkout');
  }
}
