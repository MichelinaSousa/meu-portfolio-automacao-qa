import { test, expect } from '@playwright/test';
import { LoginPage } from '../PageObject/LoginPage';
import { DashboardPage } from '../PageObject/DashboardPage';
import { USUARIOS } from './fixtures/users';

test.describe('Autenticação', () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navegarParaLogin();
    await loginPage.verificarPaginaDeLoginCarregada();
  });

  // =========================================================
  // CENÁRIOS DE SUCESSO
  // =========================================================

  test('CT001 - Login com credenciais válidas', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Act
    await loginPage.loginComSucesso(USUARIOS.valido.email, USUARIOS.valido.senha);

    // Assert
    await dashboardPage.verificarUsuarioLogado();
  });

  test('CT002 - Logout realizado com sucesso após login', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Act
    await loginPage.loginComSucesso(USUARIOS.valido.email, USUARIOS.valido.senha);
    await dashboardPage.realizarLogout();

    // Assert
    await dashboardPage.verificarLogoutRealizado();
  });

  // =========================================================
  // CENÁRIOS DE FALHA / VALIDAÇÃO
  // =========================================================

  test('CT003 - Login com credenciais inválidas exibe mensagem de erro', async ({ page }) => {
    test.slow();

    // Arrange
    const loginPage = new LoginPage(page);

    // Act
    await loginPage.realizarLogin(USUARIOS.invalido.email, USUARIOS.invalido.senha);

    // Assert
    await loginPage.verificarMensagemDeErro('Invalid email or password');
  });

  test('CT004 - Login sem preencher senha exibe validação', async ({ page }) => {
    test.slow();

    // Arrange
    const loginPage = new LoginPage(page);

    // Act
    await loginPage.realizarLogin(USUARIOS.semSenha.email, USUARIOS.semSenha.senha);

    // Assert
    await expect(page.locator('form')).toBeVisible();
    await expect(page).not.toHaveURL(/account/);
  });

  test('CT005 - Login sem preencher e-mail exibe validação', async ({ page }) => {
    test.slow();

    // Arrange
    const loginPage = new LoginPage(page);

    // Act
    await loginPage.realizarLogin(USUARIOS.semEmail.email, USUARIOS.semEmail.senha);

    // Assert
    await expect(page.locator('form')).toBeVisible();
    await expect(page).not.toHaveURL(/account/);
  });

  // =========================================================
  // NAVEGAÇÃO
  // =========================================================

  test('CT006 - Página de login é acessível pela URL direta', async ({ page }) => {
    // Assert - beforeEach já navegou e verificou
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('CT007 - Link "Forgot Password" está disponível na página de login', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);

    // Assert
    await loginPage.verificarElementoVisivel(loginPage.linkEsqueceuSenha);
  });

});
