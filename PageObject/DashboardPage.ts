import type { Page, Locator } from 'playwright-core';
import { BasePage } from './BasePage';

/**
 * DashboardPage - Page Object da área logada do usuário
 * Site demo: https://practicesoftwaretesting.com
 */
export class DashboardPage extends BasePage {
  // =========================================================
  // LOCATORS - CABEÇALHO / MENU DO USUÁRIO
  // =========================================================

  readonly menuUsuario: Locator;
  readonly labelNomeUsuario: Locator;
  readonly botaoLogout: Locator;

  // =========================================================
  // LOCATORS - PÁGINA "MY ACCOUNT"
  // =========================================================

  readonly tituloMyAccount: Locator;
  readonly menuMeuPerfil: Locator;
  readonly menuMeusFavoritos: Locator;
  readonly menuMinhasCompras: Locator;

  // =========================================================
  // LOCATORS - CATÁLOGO DE PRODUTOS (HOME)
  // =========================================================

  readonly campoBusca: Locator;
  readonly botaoBuscar: Locator;
  readonly listagemProdutos: Locator;
  readonly cartaoProduto: Locator;

  constructor(page: Page) {
    super(page);

    // Cabeçalho
    this.menuUsuario     = page.getByTestId('nav-menu');
    this.labelNomeUsuario = page.getByTestId('nav-menu');
    this.botaoLogout     = page.getByTestId('nav-sign-out');

    // My Account
    this.tituloMyAccount  = page.getByTestId('page-title');
    this.menuMeuPerfil    = page.getByTestId('nav-profile').or(page.getByTestId('nav-my-profile'));
    this.menuMeusFavoritos = page.getByTestId('nav-favorites').or(page.getByTestId('nav-my-favorites'));
    this.menuMinhasCompras = page.getByTestId('nav-invoices').or(page.getByTestId('nav-my-invoices'));

    // Catálogo
    this.campoBusca      = page.getByTestId('search-query');
    this.botaoBuscar     = page.getByTestId('search-submit');
    this.listagemProdutos = page.locator('[data-testid="product-list"]');
    this.cartaoProduto   = page.locator('[data-testid="product-name"]').first();
  }

  // =========================================================
  // AÇÕES
  // =========================================================

  async navegarParaDashboard() {
    await this.navegarPara('/account');
  }

  async realizarLogout() {
    await this.clicar(this.menuUsuario);
    await this.clicar(this.botaoLogout);
    await this.aguardarURL('/auth/login');
  }

  async buscarProduto(nomeProduto: string) {
    await this.navegarPara('/');
    await this.preencherCampo(this.campoBusca, nomeProduto);
    await this.clicar(this.botaoBuscar);
  }

  async irParaMeuPerfil() {
    await this.navegarPara('/account');
    await this.clicar(this.menuMeuPerfil);
  }

  // =========================================================
  // VERIFICAÇÕES
  // =========================================================

  async verificarUsuarioLogado() {
    await this.verificarElementoVisivel(this.tituloMyAccount);
  }

  async verificarNomeUsuario(nomeEsperado: string) {
    await this.verificarTexto(this.labelNomeUsuario, nomeEsperado);
  }

  async verificarLogoutRealizado() {
    await this.aguardarURL('/auth/login');
    await this.verificarURL('/auth/login');
  }
}
