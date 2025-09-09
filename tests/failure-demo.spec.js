const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./models/TodoPage');

test.describe('Teste de Falha - Demonstração', () => {
    let todoPage;

    test.beforeEach(async ({ page }) => {
        todoPage = new TodoPage(page);
        await todoPage.goto();
    });

    test('Teste de Falha: Seletor incorreto do botão adicionar', async () => {
        const taskText = 'Minha primeira tarefa';

        // Preenche o input corretamente (igual ao teste original)
        await todoPage.locators.taskInput.fill(taskText);
        await todoPage.page.waitForTimeout(1000);

        // ERRO PROPOSITAL: Usa seletor incorreto para o botão
        // Original: [data-testid="add-button"]
        // Incorreto: [data-testid="adicionar-button"] 
        await todoPage.page.locator('[data-testid="adicionar-button"]').click();
        await todoPage.page.waitForTimeout(1000);

        // Estas verificações vão falhar porque a tarefa não foi adicionada
        expect(await todoPage.getTaskCount()).toBe(1);
        expect(await todoPage.getTaskText(0)).toBe(taskText);
        expect(await todoPage.isEmptyStateVisible()).toBe(false);
    });
});
