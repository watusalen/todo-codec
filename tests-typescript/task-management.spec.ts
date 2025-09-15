import { test, expect, Page } from '@playwright/test';
import { TodoPage } from './models/TodoPage';

/**
 * Conjunto de testes para gerenciamento de tarefas
 * 
 * Estes testes verificam as operações de gerenciamento:
 * - Exclusão de tarefas
 * - Confirmações de exclusão
 * - Cancelamento de operações
 */
test.describe('Todo App - Gerenciamento (TypeScript)', () => {
    /** Instância da página Todo para usar nos testes */
    let todoPage: TodoPage;

    /**
     * Executa antes de cada teste individual
     * Garante que cada teste comece com um estado limpo
     */
    test.beforeEach(async ({ page }: { page: Page }) => {
        todoPage = new TodoPage(page);
        await todoPage.goto();
        await todoPage.clearLocalStorage();
        await todoPage.reload();
    });

    /**
     * Testa exclusão de tarefa com confirmação
     * 
     * Fluxo do teste:
     * 1. Adiciona uma tarefa
     * 2. Clica em excluir
     * 3. Confirma a exclusão
     * 4. Verifica que a tarefa foi removida
     */
    test('deve excluir tarefa confirmando', async () => {
        const taskText = 'Tarefa para excluir';

        // Adiciona uma tarefa
        await todoPage.addTask(taskText);
        expect(await todoPage.getTaskCount()).toBe(1);

        // Exclui confirmando (true = confirma a exclusão)
        await todoPage.deleteTask(0, true);

        // Verifica que foi excluída
        expect(await todoPage.getTaskCount()).toBe(0);
        expect(await todoPage.isEmptyStateVisible()).toBe(true);
    });

    /**
     * Testa cancelamento de exclusão de tarefa
     * 
     * Fluxo do teste:
     * 1. Adiciona uma tarefa
     * 2. Clica em excluir
     * 3. Cancela a exclusão
     * 4. Verifica que a tarefa ainda existe
     */
    test('deve cancelar exclusão de tarefa', async () => {
        const taskText = 'Tarefa para não excluir';

        // Adiciona uma tarefa
        await todoPage.addTask(taskText);
        expect(await todoPage.getTaskCount()).toBe(1);

        // Tenta excluir mas cancela (false = cancela a exclusão)
        await todoPage.deleteTask(0, false);

        // Verifica que ainda existe
        expect(await todoPage.getTaskCount()).toBe(1);
        expect(await todoPage.getTaskText(0)).toBe(taskText);
    });
});
