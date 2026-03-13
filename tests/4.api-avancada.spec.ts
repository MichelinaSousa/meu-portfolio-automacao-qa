import { expect, test } from '@playwright/test';

const API_BASE_URL = process.env['API_BASE_URL'] ?? 'https://api.practicesoftwaretesting.com';

test.describe('API - Cenários avançados (Fase 3)', () => {
  test('CT301 - GET /brands retorna coleção com estrutura mínima', async ({ request, browserName }) => {
    test.skip(browserName !== 'chromium', 'Executar API apenas no projeto chromium.');

    const response = await request.get(`${API_BASE_URL}/brands`);
    expect(response.status()).toBe(200);

    const body = (await response.json()) as Array<{ id?: string; name?: string; slug?: string }>;
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]?.id).toBeTruthy();
    expect(body[0]?.name).toBeTruthy();
    expect(body[0]?.slug).toBeTruthy();
  });

  test('CT302 - GET /categories retorna coleção com estrutura mínima', async ({ request, browserName }) => {
    test.skip(browserName !== 'chromium', 'Executar API apenas no projeto chromium.');

    const response = await request.get(`${API_BASE_URL}/categories`);
    expect(response.status()).toBe(200);

    const body = (await response.json()) as Array<{ id?: string; name?: string; slug?: string }>;
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]?.id).toBeTruthy();
    expect(body[0]?.name).toBeTruthy();
  });

  test('CT303 - GET /products com sort=price,asc respeita ordenação crescente', async ({ request, browserName }) => {
    test.skip(browserName !== 'chromium', 'Executar API apenas no projeto chromium.');

    const response = await request.get(`${API_BASE_URL}/products`, {
      params: { sort: 'price,asc' },
    });
    expect(response.status()).toBe(200);

    const body = (await response.json()) as { data: Array<{ price: number }> };
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.data.length).toBeGreaterThan(1);

    for (let i = 1; i < body.data.length; i += 1) {
      expect(body.data[i].price).toBeGreaterThanOrEqual(body.data[i - 1].price);
    }
  });

  test('CT304 - GET /products/search com termo inexistente retorna lista vazia', async ({ request, browserName }) => {
    test.skip(browserName !== 'chromium', 'Executar API apenas no projeto chromium.');

    const response = await request.get(`${API_BASE_URL}/products/search`, {
      params: { q: 'termo-inexistente-qa-automacao-2026-xyz' },
    });
    expect(response.status()).toBe(200);

    const body = (await response.json()) as { data: Array<unknown> };
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.data.length).toBe(0);
  });

  test('CT305 - POST /users/login com credenciais inválidas não autentica', async ({ request, browserName }) => {
    test.skip(browserName !== 'chromium', 'Executar API apenas no projeto chromium.');

    const response = await request.post(`${API_BASE_URL}/users/login`, {
      data: {
        email: 'usuario-invalido@teste.com',
        password: 'senha-errada',
      },
    });

    expect(response.status()).not.toBe(200);
    expect(response.ok()).toBeFalsy();
  });

  test('CT306 - Carrinho via API permite atualizar quantidade do item', async ({ request, browserName }) => {
    test.skip(browserName !== 'chromium', 'Executar API apenas no projeto chromium.');

    const createCart = await request.post(`${API_BASE_URL}/carts`);
    expect(createCart.status()).toBe(201);
    const cart = (await createCart.json()) as { id: string };

    const products = await request.get(`${API_BASE_URL}/products`);
    expect(products.status()).toBe(200);
    const productsBody = (await products.json()) as { data: Array<{ id: string }> };
    const productId = productsBody.data[0]?.id;
    expect(productId).toBeTruthy();

    const addItem = await request.post(`${API_BASE_URL}/carts/${cart.id}`, {
      data: { product_id: productId, quantity: 1 },
    });
    expect(addItem.status()).toBe(200);

    const updateQty = await request.put(`${API_BASE_URL}/carts/${cart.id}/product/quantity`, {
      data: { product_id: productId, quantity: 3 },
    });
    expect(updateQty.status()).toBe(200);

    const getCart = await request.get(`${API_BASE_URL}/carts/${cart.id}`);
    expect(getCart.status()).toBe(200);
    const cartBody = (await getCart.json()) as { id?: string };
    expect(cartBody.id).toBe(cart.id);
  });
});
