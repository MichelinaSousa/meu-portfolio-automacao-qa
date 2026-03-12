import { expect } from '@playwright/test';
import type { Page, Locator } from 'playwright-core';

/**
 * BasePage - Classe base para todos os Page Objects
 * Contém métodos genéricos reutilizáveis em qualquer página
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // =========================================================
  // NAVEGAÇÃO
  // =========================================================

  async navegarPara(path: string = '') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  }

  async aguardarURL(urlParcial: string) {
    await this.page.waitForURL(`**${urlParcial}**`, { timeout: 30_000 });
  }

  // =========================================================
  // INTERAÇÕES GENÉRICAS
  // =========================================================

  async preencherCampo(locator: Locator, valor: string) {
    await locator.waitFor({ state: 'visible', timeout: 15_000 });
    await locator.clear();
    await locator.fill(valor);
  }

  async clicar(locator: Locator) {
    await locator.waitFor({ state: 'visible', timeout: 15_000 });
    await locator.click();
  }

  async aguardarElemento(locator: Locator, timeout = 15_000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async elementoEstaVisivel(locator: Locator): Promise<boolean> {
    return locator.isVisible().catch(() => false);
  }

  async obterTexto(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible', timeout: 15_000 });
    return (await locator.textContent()) ?? '';
  }

  // =========================================================
  // ASSERÇÕES GENÉRICAS
  // =========================================================

  async verificarElementoVisivel(locator: Locator) {
    await expect(locator).toBeVisible({ timeout: 15_000 });
  }

  async verificarTexto(locator: Locator, textoEsperado: string) {
    await expect(locator).toContainText(textoEsperado, { timeout: 15_000 });
  }

  async verificarURL(urlEsperada: string) {
    await expect(this.page).toHaveURL(new RegExp(urlEsperada), { timeout: 15_000 });
  }

  // =========================================================
  // UTILITÁRIOS
  // =========================================================

  async tirarScreenshot(nome: string) {
    await this.page.screenshot({ path: `test-results/screenshots/${nome}.png` });
  }

  async aguardar(ms: number) {
    await this.page.waitForTimeout(ms);
  }
}
