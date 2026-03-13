import fs from 'node:fs';
import path from 'node:path';

type JsonReport = {
  config?: {
    version?: string;
    projects?: Array<{ name?: string }>;
  };
  suites?: ReportSuite[];
};

type ReportSuite = {
  title?: string;
  file?: string;
  specs?: ReportSpec[];
  suites?: ReportSuite[];
};

type ReportSpec = {
  title?: string;
  file?: string;
  tests?: ReportTest[];
};

type ReportTest = {
  projectName?: string;
  status?: string;
  results?: Array<{
    status?: string;
    duration?: number;
  }>;
};

type Stats = {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  timedOut: number;
  durationMs: number;
  byProject: Map<string, number>;
  byFile: Map<string, { total: number; failed: number }>;
};

function collectSpecs(suites: ReportSuite[] = [], specs: ReportSpec[] = []): ReportSpec[] {
  for (const suite of suites) {
    if (suite.specs?.length) specs.push(...suite.specs);
    if (suite.suites?.length) collectSpecs(suite.suites, specs);
  }
  return specs;
}

function computeStats(report: JsonReport): Stats {
  const stats: Stats = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    timedOut: 0,
    durationMs: 0,
    byProject: new Map(),
    byFile: new Map(),
  };

  const specs = collectSpecs(report.suites ?? []);

  for (const spec of specs) {
    const fileName = (spec.file ?? 'desconhecido').replace(/\\/g, '/');

    for (const test of spec.tests ?? []) {
      stats.total += 1;

      const finalResult = [...(test.results ?? [])].pop();
      const resultStatus = finalResult?.status ?? test.status ?? 'unknown';
      const duration = finalResult?.duration ?? 0;
      stats.durationMs += duration;

      const project = test.projectName ?? 'unknown';
      stats.byProject.set(project, (stats.byProject.get(project) ?? 0) + 1);

      const fileStats = stats.byFile.get(fileName) ?? { total: 0, failed: 0 };
      fileStats.total += 1;

      if (resultStatus === 'passed') stats.passed += 1;
      else if (resultStatus === 'skipped') stats.skipped += 1;
      else if (resultStatus === 'timedOut') {
        stats.timedOut += 1;
        stats.failed += 1;
        fileStats.failed += 1;
      } else {
        stats.failed += 1;
        fileStats.failed += 1;
      }

      stats.byFile.set(fileName, fileStats);
    }
  }

  return stats;
}

function pct(value: number): string {
  return Number.isFinite(value) ? `${value.toFixed(1)}%` : '0.0%';
}

function toDuration(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}m ${s}s`;
}

function createMarkdown(report: JsonReport, stats: Stats): string {
  const successRate = stats.total ? (stats.passed / stats.total) * 100 : 0;
  const generatedAt = new Date().toISOString();

  const projectLines = [...stats.byProject.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([project, total]) => `- ${project}: ${total} testes`)
    .join('\n');

  const fileLines = [...stats.byFile.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([file, info]) => `| ${file} | ${info.total} | ${info.failed} |`)
    .join('\n');

  return `# Sumário de Qualidade da Execução\n\n- Gerado em: ${generatedAt}\n- Playwright: ${report.config?.version ?? 'n/d'}\n\n## Resultado Geral\n\n- Total: **${stats.total}**\n- Passed: **${stats.passed}**\n- Failed: **${stats.failed}**\n- Timed out: **${stats.timedOut}**\n- Skipped: **${stats.skipped}**\n- Taxa de sucesso: **${pct(successRate)}**\n- Duração total aproximada: **${toDuration(stats.durationMs)}**\n\n## Distribuição por projeto\n\n${projectLines || '- n/d'}\n\n## Resultado por arquivo\n\n| Arquivo | Total | Falhas |\n|---|---:|---:|\n${fileLines || '| n/d | 0 | 0 |'}\n\n## Como usar este relatório\n\n1. Rodar os testes com reporter JSON:\n   - npm run test:api:all:json\n2. Gerar o resumo:\n   - npm run report:qa\n3. Publicar este arquivo no portfólio/LinkedIn como evidência da execução.\n`;
}

function main() {
  const inputArg = process.argv[2] ?? 'playwright-output.json';
  const outputArg = process.argv[3] ?? 'docs/qa/EXECUTION_SUMMARY.md';

  const inputPath = path.resolve(process.cwd(), inputArg);
  const outputPath = path.resolve(process.cwd(), outputArg);

  if (!fs.existsSync(inputPath)) {
    throw new Error(`Arquivo de entrada não encontrado: ${inputPath}`);
  }

  const raw = fs.readFileSync(inputPath, 'utf-8');
  const report = JSON.parse(raw) as JsonReport;
  const stats = computeStats(report);
  const markdown = createMarkdown(report, stats);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, markdown, 'utf-8');

  console.log(`Resumo gerado em: ${outputPath}`);
}

main();
