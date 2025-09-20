import { test, expect, Page } from '@playwright/test';
import { TodoPage } from './models/TodoPage';

/**
 * Conjunto de testes para validações do Todo App
 * 
 * Estes testes verificam se a aplicação impede operações inválidas:
 * - Tarefas vazias
 * - Tarefas duplicadas
 * - Validações de texto
 */
test.describe('Todo App - Validações (TypeScript)', () => {
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
     * Testa se a aplicação impede adicionar tarefas vazias
     * 
     * Comportamento esperado:
     * - Tentar adicionar tarefa com texto vazio não deve criar uma tarefa
     * - A lista deve continuar vazia
     * - O estado vazio deve continuar visível
     */
    test('não deve adicionar tarefa vazia', async () => {
        // Tenta adicionar tarefa vazia
        await todoPage.addTask('');

        // Verifica que não foi adicionada nenhuma tarefa
        expect(await todoPage.getTaskCount()).toBe(0);
        expect(await todoPage.isEmptyStateVisible()).toBe(true);
    });

    /**
     * Testa se a aplicação impede tarefas duplicadas
     * 
     * Comportamento esperado:
     * - Primeira tarefa deve ser adicionada normalmente
     * - Tentar adicionar a mesma tarefa novamente deve falhar
     * - Deve mostrar uma notificação de erro
     * - Deve continuar com apenas uma tarefa na lista
     */
    test('não deve adicionar tarefas duplicadas', async () => {
        const taskText = 'Tarefa duplicada';

        // Adiciona a primeira vez (deve funcionar)
        await todoPage.addTask(taskText);
        expect(await todoPage.getTaskCount()).toBe(1);

        // Tenta adicionar a mesma tarefa novamente (deve falhar)
        await todoPage.addTask(taskText);

        // Deve continuar com apenas uma tarefa
        expect(await todoPage.getTaskCount()).toBe(1);

        // Deve mostrar notificação de erro
        await expect(todoPage.locators.errorNotification).toBeVisible();
    });

    /**
     * Testa validações de texto similares mas diferentes
     * 
     * Comportamento esperado:
     * - Textos realmente diferentes devem ser aceitos
     * - Textos iguais (ignorando maiúsculas/minúsculas) devem ser rejeitados
     * 
     * Exemplo:
     * - "Comprar pão" ✅ (primeira vez)
     * - "Comprar pães" ✅ (diferente)
     * - "COMPRAR PÃO" ❌ (igual à primeira, ignorando case)
     */
    test('deve permitir tarefas similares mas diferentes', async () => {
        // Adiciona tarefas similares mas diferentes
        await todoPage.addTask('Comprar pão');      // ✅ Primeira - deve passar
        await todoPage.addTask('Comprar pães');     // ✅ Diferente - deve passar
        await todoPage.addTask('COMPRAR PÃO');      // ❌ Igual (case-insensitive) - deve ser rejeitada

        // Apenas duas devem ser aceitas (a terceira é duplicata)
        expect(await todoPage.getTaskCount()).toBe(2);
    });
});
