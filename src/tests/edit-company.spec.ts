import { test, expect } from "@playwright/test";

test.describe("Página de edición de compañía", () => {
  let companyId: string;

  test.beforeAll(async () => {
    // Crear una compañía de prueba
    const response = await fetch("http://localhost:5000/companias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: "Compañía Test",
        propietario: "Admin Test",
      }),
    });

    const company = await response.json();
    companyId = company.id; // Guardar el ID de la compañía creada
  });

  test("debe cargar los datos de la compañía para editarla", async ({
    page,
  }) => {
    // Navegar a la página de edición de la compañía
    await page.goto(`/edit-company/${companyId}`);

    // Verificar que el campo "nombre" esté precargado con los datos correctos
    const nameInput = await page.locator("input#name");
    await expect(nameInput).toHaveValue("Compañía Test");
  });

  test("debe permitir guardar los cambios", async ({ page }) => {
    await page.goto(`/edit-company/${companyId}`);

    // Llenar el campo "nombre"
    const nameInput = await page.locator("input#name");
    await nameInput.fill("Compañía Editada");

    // Hacer clic en el botón de guardar cambios
    const saveButton = await page.locator('button:has-text("Guardar cambios")');
    await saveButton.click();

    // Esperar y verificar que la redirección ocurrió
    await expect(page).toHaveURL("/");
  });

  test("no debe guardar cambios si el campo de nombre está vacío", async ({
    page,
  }) => {
    await page.goto(`/edit-company/${companyId}`);

    // Borrar el campo "nombre"
    const nameInput = await page.locator("input#name");
    await nameInput.fill("");

    // Hacer clic en el botón de guardar cambios
    const saveButton = await page.locator('button:has-text("Guardar cambios")');
    await saveButton.click();

    // Verificar que no hubo redirección (se espera que el usuario no se redirija si no se guardan los cambios)
    await expect(page).toHaveURL(`/edit-company/${companyId}`);
  });
});
