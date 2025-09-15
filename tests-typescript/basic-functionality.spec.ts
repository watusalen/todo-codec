import { test, expect, Page } from '@playwright/test';
import { TodoPage } from './models/TodoPage';

/**
 * Conjunto de testes para funcionalidades básicas do Todo App
 * 
 * Estes testes verificam se as operações fundamentais estão funcionando:
 * - Carregamento da página
 * - Adição de tarefas
 * - Marcação de tarefas como concluídas
 */
test.describe('Todo App - Testes Básicos (TypeScript)', () => {
    /** Instância da página Todo para usar nos testes */
    let todoPage: TodoPage;

    /**
     * Executa antes de cada teste individual
     * Garante que cada teste comece com um estado limpo
     */
    test.beforeEach(async ({ page }: { page: Page }) => {
        todoPage = new TodoPage(page);
        await todoPage.goto();                 // Navega para a página
        await todoPage.clearLocalStorage();    // Limpa dados salvos
        await todoPage.reload();               // Recarrega para garantir estado limpo
    });

    /**
     * Testa se a página carrega corretamente
     * 
     * Verifica:
     * - Se os elementos principais estão visíveis
     * - Se o estado inicial está correto (lista vazia)
     */
    test('deve carregar a página corretamente', async () => {
        // Verifica se os elementos principais estão visíveis
        await expect(todoPage.locators.taskInput).toBeVisible();
        await expect(todoPage.locators.addButton).toBeVisible();
        await expect(todoPage.locators.taskList).toBeVisible();

        // Verifica se está mostrando a tela vazia (estado inicial correto)
        expect(await todoPage.isEmptyStateVisible()).toBe(true);
        expect(await todoPage.getTaskCount()).toBe(0);
    });

    /**
     * Testa a funcionalidade de adicionar uma tarefa
     * 
     * Verifica:
     * - Se a tarefa é adicionada com sucesso
     * - Se o texto da tarefa está correto
     * - Se o estado vazio desaparece
     */
    test('deve adicionar uma tarefa', async () => {
        const taskText = 'Minha primeira tarefa';

        // Adiciona a tarefa
        await todoPage.addTask(taskText);

        // Verifica se foi adicionada corretamente
        expect(await todoPage.getTaskCount()).toBe(1);
        expect(await todoPage.getTaskText(0)).toBe(taskText);
        expect(await todoPage.isEmptyStateVisible()).toBe(false);
    });

    /**
     * Testa a funcionalidade de marcar tarefa como concluída
     * 
     * Verifica:
     * - Estado inicial da tarefa (não concluída)
     * - Marcação como concluída
     * - Desmarcação (volta para pendente)
     */
    test('deve marcar tarefa como concluída', async () => {
        const taskText = 'Tarefa para concluir';

        // Adiciona a tarefa e verifica que não está concluída
        await todoPage.addTask(taskText);
        expect(await todoPage.isTaskCompleted(0)).toBe(false);

        // Marca como concluída e verifica
        await todoPage.toggleTaskComplete(0);
        expect(await todoPage.isTaskCompleted(0)).toBe(true);

        // Desmarca e verifica que voltou para pendente
        await todoPage.toggleTaskComplete(0);
        expect(await todoPage.isTaskCompleted(0)).toBe(false);
    });
});
