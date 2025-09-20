import { test, expect } from '@playwright/test';
import { TodoPage } from './models/TodoPage';

test.describe('Teste de Falha - Demonstração', () => {
    let todoPage: TodoPage;

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

    test('Teste de Falha: Verificação de texto incorreto', async () => {
        const taskText = 'Tarefa de teste';

        // Adiciona a tarefa corretamente
        await todoPage.addTask(taskText);
        await todoPage.page.waitForTimeout(1000);

        // ERRO PROPOSITAL: Verifica um texto diferente do que foi inserido
        expect(await todoPage.getTaskText(0)).toBe('Texto Completamente Diferente');
        expect(await todoPage.getTaskCount()).toBe(2); // Esperamos 2 mas só temos 1
    });

    test('Teste de Falha: Elemento inexistente', async () => {
        // ERRO PROPOSITAL: Tenta interagir com elemento que não existe
        const inexistentElement = todoPage.page.locator('[data-testid="botao-inexistente"]');
        
        // Este clique vai falhar porque o elemento não existe
        await inexistentElement.click();
        
        // Se chegasse aqui, faria verificações que nunca serão executadas
        expect(await todoPage.getTaskCount()).toBe(0);
    });

    test('Teste de Falha: Timeout em elemento que demora para aparecer', async () => {
        // ERRO PROPOSITAL: Configura timeout muito baixo para um elemento que demora
        await todoPage.page.locator('[data-testid="task-input"]').fill('Teste timeout');
        
        // Timeout muito baixo (100ms) para um elemento que pode demorar mais para aparecer
        await expect(todoPage.page.locator('[data-testid="add-button"]')).toBeVisible({ timeout: 100 });
        
        await todoPage.page.locator('[data-testid="add-button"]').click();
        expect(await todoPage.getTaskCount()).toBe(1);
    });
});