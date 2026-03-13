import { expect, test } from '@playwright/test';

const API_BASE_URL = process.env['API_BASE_URL'] ?? 'https://api.practicesoftwaretesting.com';

type Product = {
  id?: string;
  name?: string;
  price?: number;
  description?: string;
  category?: { id?: string; name?: string };
  brand?: { id?: string; name?: string };
};

function validarContratoProduto(produto: Product) {
  expect(produto.id).toBeTruthy();
  expect(produto.name).toBeTruthy();
  expect(typeof produto.price).toBe('number');
  expect(produto.description).toBeTruthy();
  expect(produto.category?.id).toBeTruthy();
  expect(produto.category?.name).toBeTruthy();
  expect(produto.brand?.id).toBeTruthy();
  expect(produto.brand?.name).toBeTruthy();
}

test.describe('API - Contrato e regressão (Fase 4)', () => {
  test('CT401 @smoke - Contrato base de GET /products', async ({ request, browserName }) => {
    test.skip(browserName !== 'chromium', 'Executar API apenas no projeto chromium.');

    const response = await request.get(`${API_BASE_URL}/products`);
    expect(response.status()).toBe(200);

    const body = (await response.json()) as {
      current_page?: number;
      data: Product[];
      total?: number;
      per_page?: number;
    };

    expect(typeof body.current_page).toBe('number');
    expect(typeof body.total).toBe('number');
    expect(typeof body.per_page).toBe('number');
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.data.length).toBeGreaterThan(0);

    validarContratoProduto(body.data[0]);
  });

  test('CT402 @smoke - Contrato de GET /products/{id}', async ({ request, browserName }) => {
    test.skip(browserName !== 'chromium', 'Executar API apenas no projeto chromium.');

    const lista = await request.get(`${API_BASE_URL}/products`);
    expect(lista.status()).toBe(200);

    const listaBody = (await lista.json()) as { data: Product[] };
    const productId = listaBody.data[0]?.id;
    expect(productId).toBeTruthy();

    const response = await request.get(`${API_BASE_URL}/products/${productId}`);
    expect(response.status()).toBe(200);

    const body = (await response.json()) as Product;
    validarContratoProduto(body);
  });

  test('CT403 @regression - GET /products com between respeita faixa de preço', async ({ request, browserName }) => {
    test.skip(browserName !== 'chromium', 'Executar API apenas no projeto chromium.');

    const min = 10;
    const max = 50;

    const response = await request.get(`${API_BASE_URL}/products`, {
      params: { between: `price,${min},${max}` },
    });
    expect(response.status()).toBe(200);

    const body = (await response.json()) as { data: Product[] };
    expect(Array.isArray(body.data)).toBeTruthy();

    for (const produto of body.data) {
      expect(typeof produto.price).toBe('number');
      expect((produto.price as number) >= min).toBeTruthy();
      expect((produto.price as number) <= max).toBeTruthy();
    }
  });

  test('CT404 @regression - GET /products com sort=price,desc retorna ordem decrescente', async ({ request, browserName }) => {
    test.skip(browserName !== 'chromium', 'Executar API apenas no projeto chromium.');

    const response = await request.get(`${API_BASE_URL}/products`, {
      params: { sort: 'price,desc' },
    });
    expect(response.status()).toBe(200);

    const body = (await response.json()) as { data: Product[] };
    expect(body.data.length).toBeGreaterThan(1);

    for (let i = 1; i < body.data.length; i += 1) {
      expect((body.data[i].price as number) <= (body.data[i - 1].price as number)).toBeTruthy();
    }
  });

  test('CT405 @regression - GET /categories/tree retorna estrutura hierárquica válida', async ({ request, browserName }) => {
    test.skip(browserName !== 'chromium', 'Executar API apenas no projeto chromium.');

    const response = await request.get(`${API_BASE_URL}/categories/tree`);
    expect(response.status()).toBe(200);

    const body = (await response.json()) as Array<{
      id?: string;
      name?: string;
      slug?: string;
      sub_categories?: Array<{ id?: string; name?: string; slug?: string }>;
    }>;

    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]?.id).toBeTruthy();
    expect(body[0]?.name).toBeTruthy();
    expect(Array.isArray(body[0]?.sub_categories)).toBeTruthy();
  });
});
