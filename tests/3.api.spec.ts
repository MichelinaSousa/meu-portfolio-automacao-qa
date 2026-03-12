import { expect, test } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';
import { USUARIOS } from './fixtures/users';

const API_BASE_URL = process.env['API_BASE_URL'] ?? 'https://api.practicesoftwaretesting.com';

type LoginResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

async function loginViaApi(request: APIRequestContext): Promise<LoginResponse> {
  const response = await request.post(`${API_BASE_URL}/users/login`, {
    data: {
      email: USUARIOS.valido.email,
      password: USUARIOS.valido.senha,
    },
  });

  expect(response.ok()).toBeTruthy();

  const body = (await response.json()) as LoginResponse;
  expect(body.access_token).toBeTruthy();
  expect(body.token_type.toLowerCase()).toBe('bearer');

  return body;
}

test.describe('API - Toolshop (Fase 2)', () => {
  test('CT201 - GET /products retorna produtos paginados', async ({ request, browserName }) => {
    test.skip(browserName !== 'chromium', 'Executar API apenas no projeto chromium.');

    const response = await request.get(`${API_BASE_URL}/products`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('data');
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.data.length).toBeGreaterThan(0);
    expect(body).toHaveProperty('current_page');
    expect(body).toHaveProperty('total');
  });

  test('CT202 - GET /products/search retorna resultados para termo válido', async ({ request, browserName }) => {
    test.skip(browserName !== 'chromium', 'Executar API apenas no projeto chromium.');

    const termo = 'pliers';
    const response = await request.get(`${API_BASE_URL}/products/search`, {
      params: { q: termo },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.data.length).toBeGreaterThan(0);

    const algumProdutoRelacionado = body.data.some((item: { name?: string }) =>
      (item.name ?? '').toLowerCase().includes(termo),
    );

    expect(algumProdutoRelacionado).toBeTruthy();
  });

  test('CT203 - POST /users/login com credenciais válidas retorna token', async ({ request, browserName }) => {
    test.skip(browserName !== 'chromium', 'Executar API apenas no projeto chromium.');

    const response = await request.post(`${API_BASE_URL}/users/login`, {
      data: {
        email: USUARIOS.valido.email,
        password: USUARIOS.valido.senha,
      },
    });

    expect(response.status()).toBe(200);

    const body = (await response.json()) as LoginResponse;
    expect(body.access_token).toBeTruthy();
    expect(body.token_type.toLowerCase()).toBe('bearer');
    expect(body.expires_in).toBeGreaterThan(0);
  });

  test('CT204 - GET /users/me sem token retorna unauthorized', async ({ request, browserName }) => {
    test.skip(browserName !== 'chromium', 'Executar API apenas no projeto chromium.');

    const response = await request.get(`${API_BASE_URL}/users/me`);

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect((body.message ?? '').toLowerCase()).toContain('unauthorized');
  });

  test('CT205 - GET /users/me com token válido retorna dados do usuário', async ({ request, browserName }) => {
    test.skip(browserName !== 'chromium', 'Executar API apenas no projeto chromium.');

    const auth = await loginViaApi(request);

    const response = await request.get(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${auth.access_token}`,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.email).toBe(USUARIOS.valido.email);
    expect(body.first_name).toBeTruthy();
    expect(body.last_name).toBeTruthy();
  });

  test('CT206 - Fluxo de carrinho via API (criar carrinho e adicionar item)', async ({ request, browserName }) => {
    test.skip(browserName !== 'chromium', 'Executar API apenas no projeto chromium.');

    const cartResponse = await request.post(`${API_BASE_URL}/carts`);
    expect(cartResponse.status()).toBe(201);

    const cartBody = await cartResponse.json();
    expect(cartBody.id).toBeTruthy();

    const productsResponse = await request.get(`${API_BASE_URL}/products`);
    expect(productsResponse.status()).toBe(200);

    const productsBody = await productsResponse.json();
    const firstProduct = productsBody.data?.[0];
    expect(firstProduct?.id).toBeTruthy();

    const addItemResponse = await request.post(`${API_BASE_URL}/carts/${cartBody.id}`, {
      data: {
        product_id: firstProduct.id,
        quantity: 1,
      },
    });

    expect(addItemResponse.status()).toBe(200);

    const addItemBody = await addItemResponse.json();
    expect((addItemBody.result ?? '').toLowerCase()).toContain('item');

    const getCartResponse = await request.get(`${API_BASE_URL}/carts/${cartBody.id}`);
    expect(getCartResponse.status()).toBe(200);

    const getCartBody = await getCartResponse.json();
    expect(getCartBody.id).toBe(cartBody.id);
  });

  test('CT207 - GET /products/{id} com id inexistente retorna 404', async ({ request, browserName }) => {
    test.skip(browserName !== 'chromium', 'Executar API apenas no projeto chromium.');

    const response = await request.get(`${API_BASE_URL}/products/id-inexistente-qa-automacao`);

    expect(response.status()).toBe(404);

    const body = await response.json();
    expect((body.message ?? '').toLowerCase()).toContain('not found');
  });
});
