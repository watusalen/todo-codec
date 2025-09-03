const { BasePage } = require('./BasePage');
const { TodoLocators } = require('./TodoLocators');

/**
 * Ações específicas para tarefas
 */
class TodoActions extends BasePage {
    constructor(page) {
        super(page);
        this.locators = new TodoLocators(page);
    }

    /**
     * Adiciona uma nova tarefa
     * @param {string} taskText - Texto da tarefa
     */
    async addTask(taskText) {
        await this.locators.taskInput.fill(taskText);
        await this.page.waitForTimeout(1000);
        await this.locators.addButton.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Marca/desmarca uma tarefa como concluída
     * @param {number} taskIndex - Índice da tarefa
     */
    async toggleTaskComplete(taskIndex) {
        await this.locators.checkboxes.nth(taskIndex).click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Exclui uma tarefa
     * @param {number} taskIndex - Índice da tarefa
     * @param {boolean} confirmDelete - Se deve confirmar a exclusão
     */
    async deleteTask(taskIndex, confirmDelete = true) {
        await this.locators.deleteButtons.nth(taskIndex).click();
        
        await this.locators.confirmDialog.waitFor({ state: 'visible' });
        await this.page.waitForTimeout(1000);
        
        if (confirmDelete) {
            await this.locators.confirmYesButton.click();
            await this.page.waitForTimeout(1000);
        } else {
            await this.locators.confirmNoButton.click();
            await this.page.waitForTimeout(1000);
        }
        
        await this.locators.confirmDialog.waitFor({ state: 'hidden' });
    }

    /**
     * Edita uma tarefa existente
     * @param {number} taskIndex - Índice da tarefa
     * @param {string} newText - Novo texto da tarefa
     */
    async editTask(taskIndex, newText) {
        await this.locators.editButtons.nth(taskIndex).click();
        await this.locators.editInputs.nth(taskIndex).fill(newText);
        await this.locators.saveButtons.nth(taskIndex).click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Cancela a edição de uma tarefa
     * @param {number} taskIndex - Índice da tarefa
     */
    async cancelEditTask(taskIndex) {
        await this.locators.editButtons.nth(taskIndex).click();
        await this.locators.cancelButtons.nth(taskIndex).click();
        await this.page.waitForTimeout(1000);
    }
}

module.exports = { TodoActions };
