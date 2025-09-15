import { Page, Locator } from '@playwright/test';

/**
 * Classe que guarda todos os seletores da página Todo App
 * É como um "mapa" de onde encontrar cada elemento na tela
 * 
 * Vantagens de centralizar os seletores:
 * - Se um elemento mudar na página, só precisamos alterar aqui
 * - Evita repetir seletores em vários lugares
 * - Facilita a manutenção dos testes
 * 
 * @example
 * ```typescript
 * const locators = new TodoLocators(page);
 * await locators.taskInput.fill('Nova tarefa');
 * await locators.addButton.click();
 * ```
 */
export class TodoLocators {
    /** Instância da página do Playwright */
    page: Page;
    
    // === ELEMENTOS PRINCIPAIS ===
    /** Campo de texto para digitar nova tarefa */
    taskInput: Locator;
    /** Botão para adicionar nova tarefa */
    addButton: Locator;
    /** Container que contém a lista de tarefas */
    taskList: Locator;
    /** Mensagem mostrada quando não há tarefas */
    emptyState: Locator;
    /** Todos os itens de tarefa na lista */
    taskItems: Locator;
    
    // === CONTADORES ===
    /** Elemento que mostra o total de tarefas */
    totalTasks: Locator;
    /** Elemento que mostra quantas tarefas estão pendentes */
    pendingTasks: Locator;
    
    // === FILTROS ===
    /** Botão para mostrar todas as tarefas */
    filterAll: Locator;
    /** Botão para mostrar apenas tarefas pendentes */
    filterPending: Locator;
    /** Botão para mostrar apenas tarefas concluídas */
    filterCompleted: Locator;
    
    // === AÇÕES DAS TAREFAS ===
    /** Todos os checkboxes para marcar tarefas como concluídas */
    checkboxes: Locator;
    /** Todos os botões de editar tarefa */
    editButtons: Locator;
    /** Todos os botões de excluir tarefa */
    deleteButtons: Locator;
    /** Todos os textos das tarefas */
    taskTexts: Locator;
    
    // === EDIÇÃO DE TAREFAS ===
    /** Campos de texto que aparecem ao editar uma tarefa */
    editInputs: Locator;
    /** Botões para salvar a edição de uma tarefa */
    saveButtons: Locator;
    /** Botões para cancelar a edição de uma tarefa */
    cancelButtons: Locator;
    
    // === NOTIFICAÇÕES E MODAIS ===
    /** Notificações de erro (fundo vermelho) */
    errorNotification: Locator;
    /** Notificações de sucesso (fundo verde) */
    successNotification: Locator;
    /** Modal de confirmação para excluir tarefa */
    confirmDialog: Locator;
    /** Botão "Sim" no modal de confirmação */
    confirmYesButton: Locator;
    /** Botão "Não" no modal de confirmação */
    confirmNoButton: Locator;

    /**
     * Inicializa todos os localizadores da página
     * @param page - Instância da página do Playwright
     */
    constructor(page: Page) {
        this.page = page;
        
        // Inicializa todos os seletores usando data-testid
        // data-testid é uma boa prática para testes - elementos específicos para automação
        this.taskInput = this.page.locator('[data-testid="task-input"]');
        this.addButton = this.page.locator('[data-testid="add-button"]');
        this.taskList = this.page.locator('[data-testid="task-list"]');
        this.emptyState = this.page.locator('[data-testid="empty-state"]');
        this.taskItems = this.page.locator('[data-task-id]');
        
        // Seletores por ID (começam com #)
        this.totalTasks = this.page.locator('#totalTasks');
        this.pendingTasks = this.page.locator('#pendingTasks');
        
        // Filtros
        this.filterAll = this.page.locator('[data-testid="filter-all"]');
        this.filterPending = this.page.locator('[data-testid="filter-pending"]');
        this.filterCompleted = this.page.locator('[data-testid="filter-completed"]');
        
        // Seletores que começam com um prefixo (^= significa "começa com")
        this.checkboxes = this.page.locator('[data-testid^="task-checkbox-"]');
        this.editButtons = this.page.locator('[data-testid^="edit-button-"]');
        this.deleteButtons = this.page.locator('[data-testid^="delete-button-"]');
        this.taskTexts = this.page.locator('[data-testid^="task-text-"]');
        
        this.editInputs = this.page.locator('[data-testid^="task-edit-input-"]');
        this.saveButtons = this.page.locator('[data-testid^="save-button-"]');
        this.cancelButtons = this.page.locator('[data-testid^="cancel-button-"]');
        
        // Seletores por classe CSS (começam com .)
        this.errorNotification = this.page.locator('.bg-red-100');
        this.successNotification = this.page.locator('.bg-green-100');
        this.confirmDialog = this.page.locator('[data-testid="confirm-dialog"]');
        this.confirmYesButton = this.page.locator('[data-testid="confirm-yes"]');
        this.confirmNoButton = this.page.locator('[data-testid="confirm-no"]');
    }
}
