import { test, expect } from '@playwright/test';

test.describe('API Order & Checkout Tests', () => {
  test('should reject order creation with empty items', async ({ request }) => {
    const response = await request.post('/api/orders', {
      data: {
        name: 'Test User',
        email: 'test@example.com',
        address: '123 Test St',
        zipCode: '12345',
        items: []
      }
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBeDefined();
  });

  test('should reject order creation with invalid product IDs', async ({ request }) => {
    const response = await request.post('/api/orders', {
      data: {
        name: 'Test User',
        email: 'test@example.com',
        address: '123 Test St',
        zipCode: '12345',
        items: [
          { productId: 'invalid-id-xyz', name: 'Fake Product', quantity: 1, price: 100 }
        ]
      }
    });

    // We expect a 409 or 500 or 400 because the product does not exist in DB
    expect(response.status()).not.toBe(201);
  });
});
