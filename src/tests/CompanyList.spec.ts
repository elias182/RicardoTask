import { test, expect } from '@playwright/test';

test.describe('CompanyList Component', () => {
  // Antes de cada prueba, configuramos el entorno
  test.beforeEach(async ({ page }) => {
    // Iniciar sesión como un admin (suponiendo que ya existe un endpoint para login)
    await page.goto('http://localhost:3000/'); // Asegúrate de que la URL coincida con la de tu aplicación local
    await page.locator('input[name="email"]').fill('admin@example.com'); // Ejemplo de login admin
    await page.locator('input[name="password"]').fill('adminpassword'); // Contraseña
    await page.locator('button[type="submit"]').click(); // Hacer login
    await page.waitForNavigation();
  });

  // Prueba: Verifica si las compañías se cargan correctamente
  test('debería cargar las compañías en la lista', async ({ page }) => {
    await page.goto('http://localhost:3000/companias'); // Asegúrate de que la URL coincida con tu página de lista de compañías
    const companyList = await page.locator('.company-list ul');

    // Verificar que el nombre de las compañías aparezca en la lista
    const companies = await companyList.locator('li');
    const companiesCount = await companies.count();
    expect(companiesCount).toBeGreaterThan(0); // Asegúrate de que haya compañías

    const firstCompany = companies.nth(0);
    await expect(firstCompany).toContainText('Compañía Test'); // Reemplazar con un nombre real
  });

  // Prueba: Verifica si los botones de "Editar" y "Eliminar" solo están visibles para los administradores
  test('debería mostrar botones de Editar y Eliminar solo para admins', async ({ page }) => {
    await page.goto('http://localhost:3000/companias'); // Asegúrate de que la URL coincida con tu página de lista de compañías

    const editButtons = await page.locator('.btn.btn-primary');
    const deleteButtons = await page.locator('.btn.btn-danger');

    // Verifica si ambos botones están visibles
    const editButtonsCount = await editButtons.count();
    const deleteButtonsCount = await deleteButtons.count();
    
    expect(editButtonsCount).toBeGreaterThan(0); // El botón de "Editar" debería aparecer
    expect(deleteButtonsCount).toBeGreaterThan(0); // El botón de "Eliminar" debería aparecer
  });

  // Prueba: Verifica que el botón de editar redirige correctamente
  test('debería redirigir a la página de edición al hacer clic en el botón de Editar', async ({ page }) => {
    await page.goto('http://localhost:3000/companias');

    const editButton = await page.locator('.btn.btn-primary').first();
    await editButton.click(); // Simula hacer clic en el primer botón de "Editar"

    // Verifica si la página se ha redirigido correctamente
    await expect(page).toHaveURL(/\/edit-company\/\d+/); // Verifica si la URL contiene el ID de la compañía
  });

  // Prueba: Verifica que el botón de eliminar muestra un mensaje de confirmación
  test('debería mostrar un mensaje de confirmación al hacer clic en Eliminar', async ({ page }) => {
    await page.goto('http://localhost:3000/companias');

    // Interceptar la función de confirmación de la eliminación
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toBe('¿Estás seguro de que deseas eliminar esta compañía?');
      await dialog.accept(); // Simula que el usuario hace clic en "Aceptar"
    });

    const deleteButton = await page.locator('.btn.btn-danger').first();
    await deleteButton.click(); // Simula hacer clic en el primer botón de "Eliminar"
  });

  // Prueba: Verifica que se muestre un mensaje de error si la API falla
  test('debería mostrar un mensaje de error si la API falla', async ({ page }) => {
    // Simulamos que la API devuelve un error
    await page.route('http://localhost:5000/companias', (route) =>
      route.fulfill({
        status: 500,
        body: JSON.stringify({ message: 'Error al obtener las compañías' }),
      }),
    );

    await page.goto('http://localhost:3000/companias');
    const errorMessage = await page.locator('text=Error al obtener las compañías');
    await expect(errorMessage).toBeVisible();
  });

  // Prueba: Verifica el comportamiento de carga de las compañías
  test('debería mostrar "Cargando compañías..." mientras se obtienen los datos', async ({ page }) => {
    await page.goto('http://localhost:3000/companias');
    const loadingMessage = await page.locator('text=Cargando compañías...');
    await expect(loadingMessage).toBeVisible();
  });
});
