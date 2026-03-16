/**
 * Fase 8 – AI Test Generator
 * Gera casos de teste Playwright/TypeScript a partir de histórias de usuário
 * usando a API da OpenAI.
 *
 * Uso:
 *   npm run generate:tests
 *   npm run generate:tests -- --story scripts/user-stories/busca-produto.md
 *   npm run generate:tests -- --story scripts/user-stories/perfil-usuario.md --output tests/8.perfil.spec.ts
 */

import { config } from 'dotenv';
import OpenAI from 'openai';
import fs from 'node:fs';
import path from 'node:path';

config();

// =========================================================
// TIPOS
// =========================================================

interface CliArgs {
  story: string;
  output: string | null;
}

// =========================================================
// CLI ARGS
// =========================================================

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  let story = path.resolve(process.cwd(), 'scripts/user-stories/busca-produto.md');
  let output: string | null = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--story' && args[i + 1] !== undefined) {
      story = path.resolve(process.cwd(), args[i + 1] as string);
      i++;
    } else if (args[i] === '--output' && args[i + 1] !== undefined) {
      output = path.resolve(process.cwd(), args[i + 1] as string);
      i++;
    }
  }

  return { story, output };
}

// =========================================================
// SYSTEM PROMPT (instruções para a IA)
// =========================================================

const SYSTEM_PROMPT = `Você é um especialista em QA e automação de testes com Playwright e TypeScript.

## Contexto do Projeto
- Framework: Playwright + TypeScript
- Site alvo: https://practicesoftwaretesting.com (loja demo de ferramentas)
- Padrão: Page Object Model (POM), com classe base BasePage
- Padrão de teste: AAA (Arrange-Act-Assert)
- IDs de CT já existentes: CT001–CT405. Novos testes devem usar CT501 em diante.

## Page Objects disponíveis (pasta PageObject/)
- BasePage: navegarPara(path), clicar(locator), preencherCampo(locator, valor),
            verificarTexto(locator, texto), verificarElementoVisivel(locator), aguardarURL(url)
- LoginPage: navegarParaLogin(), realizarLogin(email, senha), loginComSucesso(email, senha),
             verificarMensagemDeErro(msg), verificarPaginaDeLoginCarregada()
- DashboardPage: navegarParaDashboard(), realizarLogout(), verificarUsuarioLogado(),
                 verificarLogoutRealizado()
- CatalogPage: navegarParaCatalogo(), buscarProduto(termo), abrirProdutoPeloNome(nome),
               verificarResultadosDaBusca(termo), verificarMensagemSemResultados(),
               cardsProdutos (Locator público), campoBusca (Locator público), botaoResetBusca (Locator público)
- ProductPage: adicionarAoCarrinho(qty?), verificarDetalhesDoProduto(nome),
               verificarBadgeCarrinhoComQuantidade(qty), abrirCarrinhoPeloHeader()
- CheckoutPage: limparCarrinhoSeNecessario(), preencherEndereco(endereco),
                selecionarMetodoPagamento(metodo), finalizarPedido(), verificarPagamentoValidado()

## Fixtures disponíveis (tests/fixtures/users.ts)
- USUARIOS.valido: { email: 'customer2@practicesoftwaretesting.com', senha: 'welcome01', nome: 'Jack Howe' }
- USUARIOS.invalido: { email: 'usuario-invalido@teste.com', senha: 'senha-errada' }
- PRODUTOS.principal: { nome: 'Combination Pliers', quantidadeInicial: 1, quantidadeAtualizada: 2 }
- ENDERECO_CHECKOUT: { street, city, state, country, postalCode }

## Regras obrigatórias
1. TypeScript estrito, sem erros de compilação
2. Nomes de variáveis, comentários e describe em português (PT-BR)
3. test.setTimeout(60_000) dentro de cada test.describe
4. IDs únicos no formato CT5XX (ex: CT501, CT502…)
5. Adicionar @smoke nos testes do caminho feliz e @regression nos negativos
6. Imports de Page Objects: '../PageObject/NomePage'
7. Imports de fixtures: './fixtures/users'
8. Asserções com expect de '@playwright/test'
9. Não inventar novos Page Objects — usar apenas os listados acima

## Formato de saída
Gere SOMENTE o código TypeScript do arquivo .spec.ts, sem texto adicional e sem markdown fences.`;

// =========================================================
// SAÍDA DEMO (usada quando OPENAI_API_KEY não está configurada)
// Demonstra o formato de output esperado usando a user story busca-produto.md
// =========================================================

const DEMO_OUTPUT = `import { expect, test } from '@playwright/test';
import { CatalogPage } from '../PageObject/CatalogPage';
import { ProductPage } from '../PageObject/ProductPage';
import { PRODUTOS } from './fixtures/users';

// =========================================================
// ATENÇÃO: Arquivo gerado em MODO DEMO (sem chamada real à IA).
// Configure OPENAI_API_KEY no .env para geração com IA real.
// =========================================================

test.describe('Filtros e Busca no Catálogo — gerado por IA (Fase 8)', () => {
  test.setTimeout(60_000);

  // ---------------------------------------------------------
  // CAMINHO FELIZ
  // ---------------------------------------------------------

  test('CT501 @smoke — Busca por nome retorna resultados relevantes', async ({ page }) => {
    // Arrange
    const catalogPage = new CatalogPage(page);
    await catalogPage.navegarParaCatalogo();

    // Act
    await catalogPage.buscarProduto('pliers');

    // Assert
    await catalogPage.verificarResultadosDaBusca('pliers');
    await catalogPage.verificarProdutoListado(PRODUTOS.principal.nome);
  });

  test('CT502 @smoke — Produto nos resultados abre página de detalhe correta', async ({ page }) => {
    // Arrange
    const catalogPage = new CatalogPage(page);
    const productPage = new ProductPage(page);
    await catalogPage.navegarParaCatalogo();
    await catalogPage.buscarProduto(PRODUTOS.principal.nome);

    // Act
    await catalogPage.abrirProdutoPeloNome(PRODUTOS.principal.nome);

    // Assert
    await expect(page).toHaveURL(/\\/product\\//);
    await productPage.verificarDetalhesDoProduto(PRODUTOS.principal.nome);
  });

  test('CT504 @smoke — Busca por termo parcial retorna produtos correspondentes', async ({ page }) => {
    // Arrange
    const catalogPage = new CatalogPage(page);
    await catalogPage.navegarParaCatalogo();

    // Act
    await catalogPage.buscarProduto('plier');

    // Assert
    await catalogPage.verificarResultadosDaBusca('plier');
    await expect(catalogPage.cardsProdutos.first()).toBeVisible({ timeout: 15_000 });
  });

  // ---------------------------------------------------------
  // CENÁRIOS NEGATIVOS
  // ---------------------------------------------------------

  test('CT503 @regression — Busca com termo inexistente exibe mensagem adequada', async ({ page }) => {
    // Arrange
    const catalogPage = new CatalogPage(page);
    await catalogPage.navegarParaCatalogo();

    // Act
    await catalogPage.buscarProduto('produto-nao-existe-xyz-automacao-2026');

    // Assert
    await catalogPage.verificarMensagemSemResultados();
  });

  test('CT505 @regression — Limpar busca restaura listagem completa de produtos', async ({ page }) => {
    // Arrange
    const catalogPage = new CatalogPage(page);
    await catalogPage.navegarParaCatalogo();
    await catalogPage.buscarProduto(PRODUTOS.principal.nome);
    await catalogPage.verificarResultadosDaBusca(PRODUTOS.principal.nome);

    // Act
    await catalogPage.clicar(catalogPage.botaoResetBusca);

    // Assert
    await expect(catalogPage.cardsProdutos.first()).toBeVisible({ timeout: 15_000 });
    await expect(catalogPage.campoBusca).toHaveValue('', { timeout: 5_000 });
  });
});`;

// =========================================================
// PRINCIPAL
// =========================================================

async function main(): Promise<void> {
  const { story: storyPath, output: outputPath } = parseArgs();

  console.log('\n🧠  AI Test Generator — Fase 8');
  console.log('━'.repeat(52));

  // Verificar existência do arquivo de história
  if (!fs.existsSync(storyPath)) {
    console.error(`\n❌  Arquivo de história não encontrado:\n    ${storyPath}`);
    console.info(`\n    Crie o arquivo ou aponte outro com: --story <caminho>\n`);
    process.exit(1);
  }

  const storyContent = fs.readFileSync(storyPath, 'utf-8');
  const storyName = path.basename(storyPath);

  console.log(`\n📖  História: ${storyName}\n`);
  console.log(storyContent.trim());
  console.log('\n' + '━'.repeat(52));

  // Decidir entre modo real (OpenAI) e modo demo
  const apiKey = process.env['OPENAI_API_KEY'];
  const hasValidKey =
    apiKey !== undefined &&
    apiKey.length > 20 &&
    apiKey !== 'your-openai-api-key-here';

  let generatedCode: string;

  if (!hasValidKey) {
    console.log('\n⚠️   OPENAI_API_KEY não configurada — executando em modo demo.');
    console.log('     Configure a chave no arquivo .env para geração real com IA.\n');
    generatedCode = DEMO_OUTPUT;
  } else {
    const model = process.env['OPENAI_MODEL'] ?? 'gpt-4';
    console.log(`\n🤖  Chamando OpenAI (modelo: ${model})...\n`);

    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Gere casos de teste Playwright TypeScript para a seguinte história de usuário:\n\n${storyContent}`,
        },
      ],
      temperature: 0.2,
      max_tokens: 4096,
    });

    const raw = completion.choices[0]?.message?.content ?? '';

    // Remover markdown fences caso a IA os adicione
    generatedCode = raw
      .replace(/^```(?:typescript|ts)?\n/m, '')
      .replace(/\n```$/m, '')
      .trim();

    if (completion.usage) {
      const { prompt_tokens, completion_tokens, total_tokens } = completion.usage;
      console.log(
        `   Tokens — prompt: ${prompt_tokens} | completion: ${completion_tokens} | total: ${total_tokens}`,
      );
    }
  }

  // Exibir código gerado
  console.log('\n✅  Código gerado:\n');
  console.log('━'.repeat(52));
  console.log(generatedCode);
  console.log('━'.repeat(52));

  // Salvar em arquivo se --output foi informado
  if (outputPath !== null) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, generatedCode, 'utf-8');
    const relativePath = path.relative(process.cwd(), outputPath);
    console.log(`\n💾  Arquivo salvo em: ${outputPath}`);
    console.log(`    Execute: npx playwright test ${relativePath} --project=chromium\n`);
  } else {
    console.log('\n💡  Próximos passos:');
    console.log('    1. Revise os testes gerados acima');
    console.log(
      '    2. Salve com: npm run generate:tests -- --story <história> --output tests/8.nome.spec.ts',
    );
    console.log('    3. Execute: npx playwright test tests/8.nome.spec.ts --project=chromium\n');
  }
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`\n❌  Erro durante geração: ${message}\n`);
  process.exit(1);
});
