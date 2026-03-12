import { expect } from '@playwright/test';
import type { Locator, Page } from 'playwright-core';
import { BasePage } from './BasePage';

interface EnderecoCheckout {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

/**
 * CheckoutPage - Page Object do carrinho e fluxo de checkout
 * Site demo: https://practicesoftwaretesting.com
 */
export class CheckoutPage extends BasePage {
  readonly navCarrinho: Locator;
  readonly badgeCarrinho: Locator;
  readonly itensCarrinho: Locator;
  readonly totalCarrinho: Locator;
  readonly botaoProsseguirCarrinho: Locator;
  readonly campoEmailCheckout: Locator;
  readonly campoSenhaCheckout: Locator;
  readonly botaoLoginCheckout: Locator;
  readonly botaoProsseguirLogin: Locator;
  readonly campoRua: Locator;
  readonly campoCidade: Locator;
  readonly campoEstado: Locator;
  readonly campoPais: Locator;
  readonly campoCep: Locator;
  readonly botaoProsseguirEndereco: Locator;
  readonly seletorPagamento: Locator;
  readonly botaoFinalizar: Locator;
  readonly mensagemPagamentoSucesso: Locator;
  readonly confirmacaoPedido: Locator;
  readonly mensagemCarrinhoVazio: Locator;

  constructor(page: Page) {
    super(page);

    this.navCarrinho = page.getByTestId('nav-cart');
    this.badgeCarrinho = page.getByTestId('cart-quantity');
    this.itensCarrinho = page.getByTestId('product-title');
    this.totalCarrinho = page.getByTestId('cart-total');
    this.botaoProsseguirCarrinho = page.getByTestId('proceed-1');
    this.campoEmailCheckout = page.getByTestId('email');
    this.campoSenhaCheckout = page.getByTestId('password');
    this.botaoLoginCheckout = page.getByTestId('login-submit');
    this.botaoProsseguirLogin = page.getByTestId('proceed-2');
    this.campoRua = page.getByTestId('street');
    this.campoCidade = page.getByTestId('city');
    this.campoEstado = page.getByTestId('state');
    this.campoPais = page.getByTestId('country');
    this.campoCep = page.getByTestId('postal_code');
    this.botaoProsseguirEndereco = page.getByTestId('proceed-3');
    this.seletorPagamento = page.getByTestId('payment-method');
    this.botaoFinalizar = page.getByTestId('finish');
    this.mensagemPagamentoSucesso = page.getByTestId('payment-success-message');
    this.confirmacaoPedido = page.locator('#order-confirmation');
    this.mensagemCarrinhoVazio = page.getByText(/cart is empty|nothing to display/i);
  }

  async navegarParaCarrinho() {
    await this.navegarPara('/checkout');
    await this.page.waitForLoadState('networkidle');
  }

  async abrirCarrinhoPeloHeader() {
    await this.clicar(this.navCarrinho);
    await this.aguardarURL('/checkout');
  }

  obterLinhaDoProduto(nomeProduto: string): Locator {
    return this.page.locator('tr').filter({ hasText: nomeProduto }).first();
  }

  async limparCarrinhoSeNecessario() {
    await this.navegarParaCarrinho();

    let tentativas = 0;
    while (await this.itensCarrinho.count()) {
      tentativas += 1;
      if (tentativas > 10) {
        throw new Error('Não foi possível limpar o carrinho após 10 tentativas.');
      }

      const primeiraLinha = this.page.locator('tbody tr').first();
      await primeiraLinha.locator('a.btn-danger, button.btn-danger').click();
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(500);
    }
  }

  async verificarProdutoNoCarrinho(nomeProduto: string) {
    await expect(this.itensCarrinho.filter({ hasText: nomeProduto }).first()).toBeVisible({ timeout: 15_000 });
  }

  async obterQuantidadeDoProduto(nomeProduto: string): Promise<string> {
    const linha = this.obterLinhaDoProduto(nomeProduto);
    return (await linha.getByTestId('product-quantity').inputValue()) ?? '';
  }

  async atualizarQuantidadeDoProduto(nomeProduto: string, quantidade: number) {
    const linha = this.obterLinhaDoProduto(nomeProduto);
    const campoQuantidade = linha.getByTestId('product-quantity');
    await campoQuantidade.fill(String(quantidade));
    await campoQuantidade.press('Tab');
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  async removerProdutoDoCarrinho(nomeProduto: string) {
    const linha = this.obterLinhaDoProduto(nomeProduto);
    await linha.locator('a.btn-danger, button.btn-danger').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verificarCarrinhoVazio() {
    await expect(this.mensagemCarrinhoVazio).toBeVisible({ timeout: 15_000 });
  }

  async obterTextoTotalCarrinho(): Promise<string> {
    await this.verificarElementoVisivel(this.totalCarrinho);
    return (await this.totalCarrinho.textContent())?.trim() ?? '';
  }

  async prosseguirDoCarrinhoParaCheckout() {
    await this.clicar(this.botaoProsseguirCarrinho);
  }

  async autenticarNoCheckoutSeNecessario(email: string, senha: string) {
    if (await this.botaoProsseguirLogin.isVisible().catch(() => false)) {
      await this.clicar(this.botaoProsseguirLogin);
      return;
    }

    if (await this.campoEmailCheckout.isVisible().catch(() => false)) {
      await this.preencherCampo(this.campoEmailCheckout, email);
      await this.preencherCampo(this.campoSenhaCheckout, senha);
      await this.clicar(this.botaoLoginCheckout);
      await expect(this.botaoProsseguirLogin).toBeVisible({ timeout: 15_000 });
      await this.clicar(this.botaoProsseguirLogin);
    }
  }

  async preencherEndereco(endereco: EnderecoCheckout) {
    await this.preencherCampo(this.campoRua, endereco.street);
    await this.preencherCampo(this.campoCidade, endereco.city);
    await this.preencherCampo(this.campoEstado, endereco.state);
    await this.preencherCampo(this.campoPais, endereco.country);
    await this.preencherCampo(this.campoCep, endereco.postalCode);
  }

  async prosseguirEndereco() {
    await this.clicar(this.botaoProsseguirEndereco);
  }

  async selecionarMetodoPagamento(metodo: string) {
    await this.seletorPagamento.selectOption(metodo);
  }

  async finalizarPedido() {
    await this.clicar(this.botaoFinalizar);
  }

  async verificarPagamentoValidado() {
    await expect(this.mensagemPagamentoSucesso).toBeVisible({ timeout: 20_000 });
    await expect(this.mensagemPagamentoSucesso).toContainText(/successful/i, { timeout: 20_000 });
  }

  async verificarPedidoConcluido() {
    await expect(this.confirmacaoPedido).toBeVisible({ timeout: 20_000 });
    await expect(this.confirmacaoPedido).toContainText(/invoice|order/i, { timeout: 20_000 });
  }
}
