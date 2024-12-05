import { test, expect } from '@playwright/test';

// Definir una URL base
const BASE_URL = 'http://localhost:3000';

test.describe('Login Component', () => {


  test('debería mostrar un mensaje de error si el correo no existe', async ({ page }) => {
    // Navegar a la página de login
    await page.goto(`${BASE_URL}/login`);

    // Ingresar un correo y una contraseña incorrectos
    await page.fill('input#email', 'correo@noexistente.com');
    await page.fill('input#password', 'contraseña123');

    // Hacer clic en el botón de iniciar sesión
    await page.locator('button:has-text("Iniciar sesión")').click();

    // Verificar que el mensaje de error "Correo no encontrado" esté visible
    await expect(page.locator('text=Correo no encontrado')).toBeVisible();
  });

  test('debería mostrar un mensaje de error si la contraseña es incorrecta', async ({ page }) => {
    // Navegar a la página de login
    await page.goto(`${BASE_URL}/login`);

    // Ingresar un correo válido pero una contraseña incorrecta
    await page.fill('input#email', 'usuario@ejemplo.com');
    await page.fill('input#password', 'contraseñaIncorrecta');

    // Hacer clic en el botón de iniciar sesión
    await page.locator('button:has-text("Iniciar sesión")').click();

    // Verificar que el mensaje de error "Contraseña incorrecta" esté visible
    await expect(page.locator('text=Contraseña incorrecta')).toBeVisible();
  });

  test('debería redirigir al dashboard cuando las credenciales son correctas', async ({ page }) => {
    // Simula que hay un usuario con las credenciales correctas
    await page.addScriptTag({
      content: `
        window.localStorage.setItem('user', JSON.stringify({
          correo: 'usuario@ejemplo.com',
          password: 'contraseña123',
        }));
      `,
    });

    // Navegar a la página de login
    await page.goto(`${BASE_URL}/login`);

    // Ingresar las credenciales correctas
    await page.fill('input#email', 'usuario@ejemplo.com');
    await page.fill('input#password', 'contraseña123');

    // Hacer clic en el botón de iniciar sesión
    await page.locator('button:has-text("Iniciar sesión")').click();

    // Verificar que el usuario sea redirigido al dashboard (suponiendo que la ruta de redirección es "/")
    await expect(page).toHaveURL(`${BASE_URL}/`);
  });



});
