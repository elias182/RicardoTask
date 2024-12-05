import { test, expect } from '@playwright/test';

// Definir la URL base para la aplicación
const BASE_URL = 'http://localhost:3000';

test.describe('Register Component', () => {
  
  test('debería mostrar un mensaje de error cuando los campos están vacíos', async ({ page }) => {
    // Navegar a la página de registro
    await page.goto(`${BASE_URL}/register`);

    // Hacer clic en el botón de registro sin completar los campos
    await page.locator('button:has-text("Registrar")').click();

    // Verificar que el mensaje de error "Por favor complete todos los campos" esté visible
    await expect(page.locator('text=Por favor complete todos los campos')).toBeVisible();
  });

  test('debería crear un nuevo usuario de tipo "usur" y asociarlo a una compañía', async ({ page }) => {
    // Simulamos que hay algunas compañías
    await page.addScriptTag({
      content: `
        window.localStorage.setItem('companias', JSON.stringify([
          { id: 1, nombre: 'Compañía A' },
          { id: 2, nombre: 'Compañía B' }
        ]));
      `,
    });

    // Navegar a la página de registro
    await page.goto(`${BASE_URL}/register`);

    // Completar el formulario de registro para un "usur"
    await page.fill('input#email', 'usuario@ejemplo.com');
    await page.fill('input#password', 'contraseña123');
    await page.fill('input#name', 'Juan Pérez');
    await page.selectOption('select#type', { value: 'usur' });

    // Seleccionar una compañía para el usuario
    await page.selectOption('select#company', { value: '1' });

    // Hacer clic en el botón de registrar
    await page.locator('button:has-text("Registrar")').click();

    // Verificar que la redirección al login ocurra después de un registro exitoso
    await expect(page).toHaveURL(`${BASE_URL}/login`);
  });

  test('debería crear un nuevo usuario de tipo "emp" y asociar una nueva compañía', async ({ page }) => {
    // Navegar a la página de registro
    await page.goto(`${BASE_URL}/register`);

    // Completar el formulario de registro para un "emp"
    await page.fill('input#email', 'empresa@ejemplo.com');
    await page.fill('input#password', 'contraseña123');
    await page.fill('input#name', 'Carlos Gómez');
    await page.selectOption('select#type', { value: 'emp' });

    // Ingresar el nombre de una nueva compañía
    await page.fill('input#companyName', 'Nueva Compañía');

    // Hacer clic en el botón de registrar
    await page.locator('button:has-text("Registrar")').click();

    // Verificar que la redirección al login ocurra después de un registro exitoso
    await expect(page).toHaveURL(`${BASE_URL}/login`);
  });

  test('debería mostrar un mensaje de error si no se puede obtener la lista de compañías', async ({ page }) => {
    // Simulamos que la API falla al obtener las compañías
    await page.route('**/companias', (route) => {
      route.abort();
    });

    // Navegar a la página de registro
    await page.goto(`${BASE_URL}/register`);

    // Completar el formulario de registro para un "usur"
    await page.fill('input#email', 'usuario@ejemplo.com');
    await page.fill('input#password', 'contraseña123');
    await page.fill('input#name', 'Juan Pérez');
    await page.selectOption('select#type', { value: 'usur' });

    // Verificar que el campo de selección de compañía esté deshabilitado
    await expect(page.locator('select#company')).toBeDisabled();

    // También verificamos si se muestra algún mensaje de error
    await expect(page.locator('text=Error al obtener las compañías')).toBeVisible();
  });

  test('debería mostrar un mensaje de error si no se puede registrar el usuario', async ({ page }) => {
    // Simulamos que la API de registro falla
    await page.route('**/usuarios', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ message: 'Error al registrar' }),
      });
    });

    // Navegar a la página de registro
    await page.goto(`${BASE_URL}/register`);

    // Completar el formulario de registro
    await page.fill('input#email', 'usuario@ejemplo.com');
    await page.fill('input#password', 'contraseña123');
    await page.fill('input#name', 'Juan Pérez');
    await page.selectOption('select#type', { value: 'usur' });

    // Seleccionar una compañía para el usuario
    await page.selectOption('select#company', { value: '1' });

    // Hacer clic en el botón de registrar
    await page.locator('button:has-text("Registrar")').click();

    // Verificar que el mensaje de error "Error al registrar" esté visible
    await expect(page.locator('text=Error al registrar')).toBeVisible();
  });

});
