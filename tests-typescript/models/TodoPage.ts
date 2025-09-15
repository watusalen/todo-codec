import { Page } from '@playwright/test';
import { TodoAssertions } from './TodoAssertions';

/**
 * Classe principal do Page Object Model para o Todo App
 * 
 * Esta é a classe que os testes devem usar. Ela junta todas as funcionalidades:
 * - BasePage: navegação, limpeza de dados, esperas
 * - TodoLocators: onde encontrar elementos na página  
 * - TodoActions: o que podemos fazer (adicionar, editar, excluir)
 * - TodoAssertions: como verificar se está funcionando
 * 
 * Herança completa:
 * BasePage → TodoLocators → TodoActions → TodoAssertions → TodoPage
 * 
 * @example
 * ```typescript
 * // Uso básico nos testes
 * const todoPage = new TodoPage(page);
 * 
 * // Navegação
 * await todoPage.goto();
 * await todoPage.clearLocalStorage();
 * 
 * // Ações
 * await todoPage.addTask('Minha tarefa');
 * await todoPage.toggleTaskComplete(0);
 * 
 * // Verificações
 * const count = await todoPage.getTaskCount();
 * const isEmpty = await todoPage.isEmptyStateVisible();
 * 
 * // Filtros
 * await todoPage.filterTasks('completed');
 * ```
 */
export class TodoPage extends TodoAssertions {

    /**
     * Cria uma nova instância da página Todo
     * Automaticamente inicializa todos os localizadores e funcionalidades
     * 
     * @param page - Instância da página do Playwright
     */
    constructor(page: Page) {
        super(page);
    }

    /**
     * Filtra as tarefas por status
     * 
     * Tipos de filtro disponíveis:
     * - 'all': Mostra todas as tarefas (pendentes e concluídas)
     * - 'pending': Mostra apenas tarefas não concluídas
     * - 'completed': Mostra apenas tarefas concluídas
     * 
     * @param filter - Tipo de filtro a aplicar
     * @throws Error se o filtro fornecido for inválido
     * 
     * @example
     * ```typescript
     * // Mostra todas as tarefas
     * await todoPage.filterTasks('all');
     * 
     * // Mostra apenas tarefas pendentes
     * await todoPage.filterTasks('pending');
     * 
     * // Mostra apenas tarefas concluídas
     * await todoPage.filterTasks('completed');
     * ```
     */
    async filterTasks(filter: 'all' | 'pending' | 'completed') {
        if (filter === 'all') {
            await this.locators.filterAll.click();
        } else if (filter === 'pending') {
            await this.locators.filterPending.click();
        } else if (filter === 'completed') {
            await this.locators.filterCompleted.click();
        } else {
            throw new Error(`Filtro inválido: ${filter}. Use 'all', 'pending' ou 'completed'.`);
        }
        await this.page.waitForTimeout(1000);
    }
}
