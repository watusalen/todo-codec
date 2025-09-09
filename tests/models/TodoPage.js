const { TodoAssertions } = require('./TodoAssertions');

/**
 * Page Object Model principal para o Todo App
 * Herda todas as funcionalidades dos módulos especializados
 */
class TodoPage extends TodoAssertions {
    constructor(page) {
        super(page);
        // Expõe os localizadores principais para compatibilidade com testes existentes
        this.taskInput = this.locators.taskInput;
        this.addButton = this.locators.addButton;
        this.taskList = this.locators.taskList;
        this.emptyState = this.locators.emptyState;
        this.taskItems = this.locators.taskItems;
        this.totalTasks = this.locators.totalTasks;
        this.pendingTasks = this.locators.pendingTasks;
        this.filterAll = this.locators.filterAll;
        this.filterPending = this.locators.filterPending;
        this.filterCompleted = this.locators.filterCompleted;
        this.checkboxes = this.locators.checkboxes;
        this.editButtons = this.locators.editButtons;
        this.deleteButtons = this.locators.deleteButtons;
        this.taskTexts = this.locators.taskTexts;
        this.editInputs = this.locators.editInputs;
        this.saveButtons = this.locators.saveButtons;
        this.cancelButtons = this.locators.cancelButtons;
        this.errorMessage = this.locators.errorNotification;
        this.successMessage = this.locators.successNotification;
        this.notificationContainer = this.locators.notificationContainer;
        this.errorNotification = this.locators.errorNotification;
        this.confirmDialog = this.locators.confirmDialog;
        this.confirmYesButton = this.locators.confirmYesButton;
        this.confirmNoButton = this.locators.confirmNoButton;
    }

    /**
     * Filtra tarefas por status
     * @param {string} filter - Filtro a aplicar ('all', 'pending', 'completed')
     */
    async filterTasks(filter) {
        switch (filter.toLowerCase()) {
            case 'all':
                await this.filterAll.click();
                break;
            case 'pending':
                await this.filterPending.click();
                break;
            case 'completed':
                await this.filterCompleted.click();
                break;
            default:
                throw new Error(`Filtro inválido: ${filter}`);
        }
        await this.page.waitForTimeout(1000);
    }
}

module.exports = { TodoPage };
