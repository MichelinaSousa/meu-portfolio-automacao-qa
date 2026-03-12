import { expect, test } from '@playwright/test';
import type { Page } from 'playwright-core';
import { CatalogPage } from '../PageObject/CatalogPage';
import { CheckoutPage } from '../PageObject/CheckoutPage';
import { LoginPage } from '../PageObject/LoginPage';
import { ProductPage } from '../PageObject/ProductPage';
import {
  ENDERECO_CHECKOUT,
  PAGAMENTO_CHECKOUT,
  PRODUTOS,
  USUARIOS,
} from './fixtures/users';

async function autenticarUsuario(page: Page) {
  const loginPage = new LoginPage(page);

  await loginPage.navegarParaLogin();
  await loginPage.loginComSucesso(USUARIOS.valido.email, USUARIOS.valido.senha);
}

async function prepararCarrinhoComProduto(page: Page) {
  const catalogPage = new CatalogPage(page);
  const productPage = new ProductPage(page);
  const checkoutPage = new CheckoutPage(page);

  await autenticarUsuario(page);
  await checkoutPage.limparCarrinhoSeNecessario();
  await catalogPage.navegarParaCatalogo();
  await catalogPage.buscarProduto(PRODUTOS.principal.nome);
  await catalogPage.abrirProdutoPeloNome(PRODUTOS.principal.nome);
  await productPage.adicionarAoCarrinho(PRODUTOS.principal.quantidadeInicial);
  await productPage.verificarBadgeCarrinhoComQuantidade(PRODUTOS.principal.quantidadeInicial);
  await productPage.abrirCarrinhoPeloHeader();
}

test.describe('Catálogo, carrinho e checkout - Fase 1', () => {
  test.setTimeout(90_000);

  test('CT101 - Busca por produto exibe resultados relevantes', async ({ page }) => {
    const catalogPage = new CatalogPage(page);

    await catalogPage.navegarParaCatalogo();
    await catalogPage.buscarProduto(PRODUTOS.principal.nome);

    await catalogPage.verificarResultadosDaBusca(PRODUTOS.principal.nome);
    await catalogPage.verificarProdutoListado(PRODUTOS.principal.nome);
  });

  test('CT102 - Usuário acessa o detalhe do produto a partir da busca', async ({ page }) => {
    const catalogPage = new CatalogPage(page);
    const productPage = new ProductPage(page);

    await catalogPage.navegarParaCatalogo();
    await catalogPage.buscarProduto(PRODUTOS.principal.nome);
    await catalogPage.abrirProdutoPeloNome(PRODUTOS.principal.nome);

    await expect(page).toHaveURL(/\/product\//);
    await productPage.verificarDetalhesDoProduto(PRODUTOS.principal.nome);
  });

  test('CT103 - Usuário autenticado adiciona produto ao carrinho com sucesso', async ({ page }) => {
    const catalogPage = new CatalogPage(page);
    const productPage = new ProductPage(page);
    const checkoutPage = new CheckoutPage(page);

    await autenticarUsuario(page);
    await checkoutPage.limparCarrinhoSeNecessario();
    await catalogPage.navegarParaCatalogo();
    await catalogPage.buscarProduto(PRODUTOS.principal.nome);
    await catalogPage.abrirProdutoPeloNome(PRODUTOS.principal.nome);
    await productPage.adicionarAoCarrinho(PRODUTOS.principal.quantidadeInicial);

    await productPage.verificarBadgeCarrinhoComQuantidade(PRODUTOS.principal.quantidadeInicial);
    await productPage.abrirCarrinhoPeloHeader();
    await checkoutPage.verificarProdutoNoCarrinho(PRODUTOS.principal.nome);
  });

  test('CT104 - Usuário atualiza a quantidade de um item no carrinho', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await prepararCarrinhoComProduto(page);

    const totalAntes = await checkoutPage.obterTextoTotalCarrinho();
    await checkoutPage.atualizarQuantidadeDoProduto(
      PRODUTOS.principal.nome,
      PRODUTOS.principal.quantidadeAtualizada,
    );
    const totalDepois = await checkoutPage.obterTextoTotalCarrinho();

    await expect(
      await checkoutPage.obterQuantidadeDoProduto(PRODUTOS.principal.nome),
    ).toBe(String(PRODUTOS.principal.quantidadeAtualizada));
    expect(totalDepois).not.toBe('');
    expect(totalDepois).not.toBe(totalAntes);
  });

  test('CT105 - Usuário remove item do carrinho com sucesso', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await prepararCarrinhoComProduto(page);
    await checkoutPage.removerProdutoDoCarrinho(PRODUTOS.principal.nome);

    await checkoutPage.verificarCarrinhoVazio();
  });

  test('CT106 - Usuário autenticado valida pagamento no checkout com sucesso', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await prepararCarrinhoComProduto(page);
    await checkoutPage.prosseguirDoCarrinhoParaCheckout();
    await checkoutPage.autenticarNoCheckoutSeNecessario(
      USUARIOS.valido.email,
      USUARIOS.valido.senha,
    );
    await checkoutPage.preencherEndereco(ENDERECO_CHECKOUT);
    await checkoutPage.prosseguirEndereco();
    await checkoutPage.selecionarMetodoPagamento(PAGAMENTO_CHECKOUT.metodo);
    await checkoutPage.finalizarPedido();
    await checkoutPage.verificarPagamentoValidado();
  });

  test('CT107 - Busca sem resultado exibe mensagem apropriada', async ({ page }) => {
    const catalogPage = new CatalogPage(page);

    await catalogPage.navegarParaCatalogo();
    await catalogPage.buscarProduto(PRODUTOS.inexistente.nome);

    await catalogPage.verificarMensagemSemResultados();
  });
});
