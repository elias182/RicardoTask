import { test, expect } from '@playwright/test';

// URL base de la aplicación
const BASE_URL = 'http://localhost:3000';

test.describe('User Profile Component', () => {
  




  test('debería mostrar un mensaje si el usuario no está autenticado', async ({ page }) => {
    // Simulamos que el usuario no está autenticado
    await page.addScriptTag({
      content: `window.localStorage.setItem('isAuthenticated', false);`
    });

    // Navegar a la página de perfil
    await page.goto(`${BASE_URL}/profile`);

    // Verificar que se muestra el mensaje "No estás autenticado"
    await expect(page.locator('text=No estás autenticado')).toBeVisible();
  });
});
