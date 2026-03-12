import { expect } from '@playwright/test';
import type { Page, Locator } from 'playwright-core';
import { BasePage } from './BasePage';

/**
 * LoginPage - Page Object da página de autenticação
 * Site demo: https://practicesoftwaretesting.com
 */
export class LoginPage extends BasePage {
  // =========================================================
  // LOCATORS
  // =========================================================

  // Campos do formulário
  readonly inputEmail: Locator;
  readonly inputSenha: Locator;
  readonly botaoLogin: Locator;

  // Mensagens de feedback
  readonly mensagemErro: Locator;
  readonly alertaInvalido: Locator;

  // Links da página
  readonly linkEsqueceuSenha: Locator;
  readonly linkCriarConta: Locator;

  // Navegação
  readonly menuLogin: Locator;

  constructor(page: Page) {
    super(page);

    // Campos
    this.inputEmail    = page.getByTestId('email');
    this.inputSenha    = page.getByTestId('password');
    this.botaoLogin    = page.getByTestId('login-submit');

    // Feedbacks
    this.mensagemErro  = page.getByTestId('login-error');
    this.alertaInvalido = page.locator('[class*="alert-danger"], .alert-danger').first();

    // Links
    this.linkEsqueceuSenha = page.getByRole('link', { name: /forgot.*password/i });
    this.linkCriarConta    = page.getByRole('link', { name: /register/i }).first();

    // Menu de navegação
    this.menuLogin = page.getByTestId('nav-sign-in');
  }

  // =========================================================
  // AÇÕES
  // =========================================================

  async navegarParaLogin() {
    await this.navegarPara('/auth/login');
  }

  async abrirLoginPeloMenu() {
    await this.clicar(this.menuLogin);
    await this.aguardarURL('/auth/login');
  }

  async realizarLogin(email: string, senha: string) {
    await this.preencherCampo(this.inputEmail, email);
    await this.preencherCampo(this.inputSenha, senha);
    await this.clicar(this.botaoLogin);
  }

  async loginComSucesso(email: string, senha: string) {
    await this.realizarLogin(email, senha);
    await this.aguardarURL('/account');
  }

  // =========================================================
  // VERIFICAÇÕES
  // =========================================================

  async verificarPaginaDeLoginCarregada() {
    await this.verificarElementoVisivel(this.inputEmail);
    await this.verificarElementoVisivel(this.inputSenha);
    await this.verificarElementoVisivel(this.botaoLogin);
  }

  async verificarMensagemDeErro(mensagem: string) {
    await expect(
      this.mensagemErro.or(this.alertaInvalido)
    ).toContainText(mensagem, { timeout: 10_000 });
  }

  async verificarLoginRealizado() {
    await this.aguardarURL('/account');
    await this.verificarURL('/account');
  }
}
