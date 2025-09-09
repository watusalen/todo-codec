/**
 * Módulo para localizadores do Todo App
 */
class TodoLocators {
    constructor(page) {
        this.page = page;
        this.initializeLocators();
    }

    initializeLocators() {
        // Elementos principais da interface
        this.taskInput = this.page.locator('[data-testid="task-input"]');
        this.addButton = this.page.locator('[data-testid="add-button"]');
        this.taskList = this.page.locator('[data-testid="task-list"]');
        this.emptyState = this.page.locator('[data-testid="empty-state"]');

        // Lista e itens de tarefa
        this.taskItems = this.page.locator('[data-task-id]');

        // Contadores
        this.totalTasks = this.page.locator('#totalTasks');
        this.pendingTasks = this.page.locator('#pendingTasks');

        // Filtros
        this.filterAll = this.page.locator('[data-testid="filter-all"]');
        this.filterPending = this.page.locator('[data-testid="filter-pending"]');
        this.filterCompleted = this.page.locator('[data-testid="filter-completed"]');

        // Ações das tarefas
        this.checkboxes = this.page.locator('[data-testid^="task-checkbox-"]');
        this.editButtons = this.page.locator('[data-testid^="edit-button-"]');
        this.deleteButtons = this.page.locator('[data-testid^="delete-button-"]');
        this.taskTexts = this.page.locator('[data-testid^="task-text-"]');

        // Edição inline
        this.editInputs = this.page.locator('[data-testid^="task-edit-input-"]');
        this.saveButtons = this.page.locator('[data-testid^="save-button-"]');
        this.cancelButtons = this.page.locator('[data-testid^="cancel-button-"]');

        // Modais e notificações
        this.notificationContainer = this.page.locator('[data-testid="notification-container"]');
        this.errorNotification = this.page.locator('.bg-red-100');
        this.successNotification = this.page.locator('.bg-green-100');
        this.confirmDialog = this.page.locator('[data-testid="confirm-dialog"]');
        this.confirmYesButton = this.page.locator('[data-testid="confirm-yes"]');
        this.confirmNoButton = this.page.locator('[data-testid="confirm-no"]');
    }
}

module.exports = { TodoLocators };
