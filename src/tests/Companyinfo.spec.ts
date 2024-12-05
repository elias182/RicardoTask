import { test, expect } from '@playwright/test';

test.describe('CompanyInfo Component', () => {
  // Antes de cada prueba, simulamos navegar a la URL de la compañía con un ID específico
  test.beforeEach(async ({ page }) => {
    // En este ejemplo, nos aseguramos de que la URL sea la correcta para cargar la página
    await page.goto('http://localhost:3000/company-info/1'); // Suponemos que el ID de la compañía es '1'
  });

  // Prueba: Verifica que se muestre el nombre y el propietario de la compañía
  test('debería mostrar el nombre y propietario de la compañía', async ({ page }) => {
    const companyName = await page.locator('h2');
    const companyOwner = await page.locator('p strong');

    // Verifica que el nombre de la compañía y el propietario estén presentes
    await expect(companyName).toHaveText('Compañía Test'); // Nombre de la compañía (esto debe ser reemplazado por el nombre real)
    await expect(companyOwner).toHaveText('Propietario:');
  });

  // Prueba: Verifica que se muestre una lista de usuarios asociados
  test('debería mostrar los usuarios asociados a la compañía', async ({ page }) => {
    const userList = await page.locator('.company-info ul');
    
    // Verifica que la lista de usuarios no esté vacía
    const usersCount = await userList.locator('li').count();
    expect(usersCount).toBeGreaterThan(0); // Verifica que haya al menos un usuario

    // Verifica que los usuarios tengan los datos correctos (nombre, correo y tipo de usuario)
    const firstUser = userList.locator('li').first();
    await expect(firstUser).toContainText('Usuario Test'); // Nombre del primer usuario
    await expect(firstUser).toContainText('user@test.com'); // Correo del primer usuario
  });

  // Prueba: Verifica el manejo de errores si no se obtienen datos
  test('debería mostrar un mensaje de error si no se puede obtener la información', async ({ page }) => {
    // Simulamos un error en la respuesta
    await page.route('http://localhost:5000/companias/1', route => route.abort());
    await page.goto('http://localhost:3000/company-info/1');
    
    // Verifica si el mensaje de error es visible
    const errorMessage = await page.locator('text=Error: No se pudo obtener la compañía');
    await expect(errorMessage).toBeVisible();
  });

  // Prueba: Verifica si no hay usuarios asociados
  test('debería mostrar "No hay usuarios asociados a esta compañía" si no hay usuarios', async ({ page }) => {
    // Simulamos que no hay usuarios para esta compañía
    await page.route('http://localhost:5000/usuarios', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify([]), // Respuesta vacía para los usuarios
      })
    );
    await page.goto('http://localhost:3000/company-info/1');
    
    const noUsersMessage = await page.locator('text=No hay usuarios asociados a esta compañía.');
    await expect(noUsersMessage).toBeVisible();
  });

  // Prueba: Verifica que el componente se muestre mientras se cargan los datos
  test('debería mostrar "Cargando información de la compañía..." mientras se obtienen los datos', async ({ page }) => {
    await page.goto('http://localhost:3000/company-info/1');
    
    const loadingMessage = await page.locator('text=Cargando información de la compañía...');
    await expect(loadingMessage).toBeVisible();
  });
});
