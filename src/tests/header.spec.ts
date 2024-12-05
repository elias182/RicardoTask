import { test, expect } from '@playwright/test';

// Definir una URL base
const BASE_URL = 'http://localhost:3000';

test.describe('Header Component', () => {


  test('debería mostrar las opciones de navegación para usuarios autenticados', async ({ page }) => {
    // Simular que el usuario está autenticado
    await page.addScriptTag({
      content: `
        window.localStorage.setItem('auth', JSON.stringify({
          isAuthenticated: true,
          userProfile: {
            nombre: 'Juan Pérez',
            compania: 1,
          }
        }));
      `,
    });

    // Navegar a la página inicial
    await page.goto(BASE_URL);

    // Verifica que el nombre del usuario esté visible
    await expect(page.locator('text=Juan Pérez')).toBeVisible();

    // Verifica que el nombre de la compañía esté visible
    await expect(page.locator('text=Compañía XYZ')).toBeVisible();

    // Verifica que el botón de "Cerrar sesión" esté presente
    await expect(page.locator('button:has-text("Cerrar sesión")')).toBeVisible();

    // Verifica que los enlaces de "Iniciar sesión" y "Registrarse" no estén presentes
    await expect(page.locator('text=Iniciar sesión')).not.toBeVisible();
    await expect(page.locator('text=Registrarse')).not.toBeVisible();
  });

});
