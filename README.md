# Meu Portfólio - Automação QA + AI

![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088F0?style=for-the-badge&logo=github-actions&logoColor=white)
[![QA Automation CI](https://github.com/MichelinaSousa/meu-portfolio-automacao-qa/actions/workflows/tests.yml/badge.svg)](https://github.com/MichelinaSousa/meu-portfolio-automacao-qa/actions/workflows/tests.yml)

## 📋 Sobre

Portfolio profissional focado em **Automação de Testes QA** com integração de **Inteligência Artificial**. Este projeto demonstra:

- ✅ **Automação E2E** com Playwright e TypeScript
- 🧠 **Integração de IA** (OpenAI/Claude) para geração e análise de testes
- 📊 **Relatórios Inteligentes** gerados automaticamente
- 🔄 **CI/CD Avançado** com GitHub Actions
- 📱 **Cross-browser Testing** (Chrome, Firefox, Safari)
- 🎯 **Page Object Model** para melhor manutenibilidade

## 🎯 Objetivo

Demonstrar como automação de testes pode ser **potencializada com IA**, criando:
- Testes mais inteligentes e adaptáveis
- Análises automáticas de falhas
- Geração automática de casos de teste a partir de histórias de usuário
- Relatórios com insights acionáveis

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- (Opcional) Chave de API OpenAI

### Instalação

```bash
git clone https://github.com/MichelinaSousa/meu-portfolio-automacao-qa.git
cd meu-portfolio-automacao-qa
npm install
```

### Executar Testes

```bash
# Modo headless
npm run test

# Somente testes de API (Fase 2)
npm run test:api

# API avançada (Fase 3)
npm run test:api:advanced

# API contrato/regressão (Fase 4)
npm run test:api:contract

# API completa (Fases 2 a 4)
npm run test:api:all

# Tags por estratégia
npm run test:smoke
npm run test:regression

# Evidência consolidada (Fase 5)
npm run phase5:evidence

# Suíte UI usada no CI
npm run test:ui:ci

# Com interface visual
npm run test:headed

# Modo interativo (UI)
npm run test:ui

# Debug detalhado
npm run test:debug
```

### Integração com IA

```bash
# Gerar testes automaticamente com IA
npm run generate:tests

# Analisar resultados com IA
npm run analyze:results
```

## 📁 Estrutura do Projeto

```
meu-portfolio-automacao-qa/
├── docs/
│   ├── ARCHITECTURE.md           # Arquitetura e padrões
│   ├── AI-INTEGRATION.md         # Como a IA está integrada
│   └── qa/
│       ├── fluxo-autenticacao.md
│       ├── fluxo-crud.md
│       └── casos-uso.md
│
├── PageObject/                    # Page Object Model
│   ├── BasePage.ts               # Classe base para todos os páginas
│   ├── LoginPage.ts              # Exemplo: página de login
│   └── DashboardPage.ts          # Exemplo: página de dashboard
│
├── tests/
│   ├── 1.autenticacao.spec.ts    # Testes de login/autenticação
│   ├── 2.catalogo-carrinho-checkout.spec.ts
│   │                             # Fluxo E2E de catálogo/carrinho/checkout
│   ├── 3.api.spec.ts             # Testes de API (auth, products, cart)
│   ├── 4.api-avancada.spec.ts    # Cenários avançados de API
│   ├── 5.api-contrato-regressao.spec.ts
│   │                             # Contrato + regressão com tags (@smoke/@regression)
│   └── fixtures/                 # Dados de teste
│
├── scripts/
│   └── generate-execution-summary.ts
│                                 # Gera sumário de execução para portfólio
│
├── .github/workflows/
│   └── tests.yml                 # Pipeline CI para UI + API em PR/push
│
├── playwright.config.ts          # Configuração do Playwright
├── tsconfig.json                 # Configuração TypeScript
├── package.json                  # Dependências
└── README.md                     # Este arquivo
```

## 🧠 Recursos de IA

### 1. **Geração Automática de Testes**
A IA analisa histórias de usuário (user stories) e gera automaticamente casos de teste estruturados.

```bash
npm run generate:tests
```

### 2. **Análise Inteligente de Falhas**
Quando testes falham, a IA analisa:
- Logs e screenshots
- Padrões de erro
- Gera relatórios com recomendações

```bash
npm run analyze:results
```

### 3. **Relatórios Contextualizados**
Geração automática de relatórios que incluem:
- Sumário executivo
- Análise de impacto
- Sugestões de correção

## 🔄 CI/CD com IA

O workflow do GitHub Actions automaticamente:
1. Executa os testes de UI em push para `main`
2. Executa os testes de API em push para `main`
3. Executa ambas as suítes em Pull Requests para `main`
4. Publica artifacts com `playwright-report` e `test-results`
5. Gera evidência consolidada de qualidade (`EXECUTION_SUMMARY.md`)
6. Permite execução manual via `workflow_dispatch`

```yaml
# Resumo do workflow atual
name: QA Automation CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

jobs:
  ui-tests:
    runs-on: ubuntu-latest
  api-tests:
    runs-on: ubuntu-latest
```

## 📊 Exemplos de Testes

### Teste Simples com Page Object
```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../PageObject/LoginPage';

test('Fazer login com sucesso', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.navigate();
  await loginPage.login('usuario@example.com', 'senha123');
  
  expect(await loginPage.isAuthenticated()).toBe(true);
});
```

## 🛠️ Configuração de IA

### Usar OpenAI

1. Crie uma conta em [openai.com](https://openai.com)
2. Gere uma API Key
3. Configure no `.env`:

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4
```

### Usar Claude (Anthropic)

1. Crie uma conta em [claude.ai](https://claude.ai)
2. Gere uma API Key
3. Configure no `.env`:

```env
ANTHROPIC_API_KEY=sk-...
```

## 📈 Métricas e Relatórios

Cada execução gera:
- ✅ Taxa de sucesso
- ⏱️ Tempo médio de testes
- 📊 Cobertura
- 🔍 Análise de estabilidade
- 💡 Recomendações da IA

Acesse os relatórios em:
```bash
npm run report
```

Para gerar evidência consolidada em markdown (Fase 5):
```bash
npm run phase5:evidence
```

Arquivo gerado:
- `docs/qa/EXECUTION_SUMMARY.md`

## 🧾 Evidências de Execução (Fase 7)

- Workflow principal (CI):
  - https://github.com/MichelinaSousa/meu-portfolio-automacao-qa/actions/workflows/tests.yml
- Histórico de runs:
  - https://github.com/MichelinaSousa/meu-portfolio-automacao-qa/actions
- Artifact de evidência consolidada (gerado no job `QA Evidence Summary (Phase 6)`):
  - `qa-execution-summary`
  - Conteúdo: `docs/qa/EXECUTION_SUMMARY.md` e `playwright-output.json`

### Como localizar rapidamente a evidência no GitHub

1. Abra a aba **Actions** do repositório.
2. Entre no run mais recente do workflow **QA Automation CI**.
3. Vá até a seção **Artifacts**.
4. Baixe o artifact **qa-execution-summary**.

## 🎓 Aprendizados & Decisões

### Por que Playwright?
- Mais rápido que Selenium
- Suporte multi-browser nativo
- Melhor debug com Trace Viewer
- Comunidade muito ativa

### Por que Page Object Model?
- Melhor manutenibilidade
- Reduz duplicação de código
- Facilita mudanças na UI
- Padrão industri reconhecido

### Por que IA?
- Automação inteligente de testes
- Análise contextualizada de falhas
- Geração automática de cobertura
- Insights acionáveis

## 🤝 Contribuindo

Este é um projeto pessoal, mas contribuições são bem-vindas!

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Contato

- LinkedIn: [Michelina Sousa](https://linkedin.com/in/michelinasousa)
- GitHub: [@MichelinaSousa](https://github.com/MichelinaSousa)

## 📄 Licença

Este projeto está sob a licença MIT. Ver arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Última atualização**: Março 2026
**Versão**: 1.0.0
**Status**: Em Desenvolvimento ✨
