const { TodoActions } = require('./TodoActions');

/**
 * Assertions e verificações para o Todo App
 */
class TodoAssertions extends TodoActions {
    constructor(page) {
        super(page);
    }

    /**
     * Obtém o texto de uma tarefa específica
     * @param {number} taskIndex - Índice da tarefa
     * @returns {Promise<string>} Texto da tarefa
     */
    async getTaskText(taskIndex) {
        return await this.locators.taskTexts.nth(taskIndex).textContent();
    }

    /**
     * Verifica se uma tarefa está marcada como concluída
     * @param {number} taskIndex - Índice da tarefa
     * @returns {Promise<boolean>} Se a tarefa está concluída
     */
    async isTaskCompleted(taskIndex) {
        return await this.locators.checkboxes.nth(taskIndex).isChecked();
    }

    /**
     * Obtém o número total de tarefas
     * @returns {Promise<number>} Número de tarefas
     */
    async getTaskCount() {
        return await this.locators.taskItems.count();
    }

    /**
     * Verifica se o estado vazio está visível
     * @returns {Promise<boolean>} Se o estado vazio está visível
     */
    async isEmptyStateVisible() {
        try {
            await this.locators.emptyState.waitFor({ state: 'visible', timeout: 1000 });
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Verifica se existe uma tarefa com o texto especificado
     * @param {string} taskText - Texto para procurar
     * @returns {Promise<boolean>} Se a tarefa existe
     */
    async hasTaskWithText(taskText) {
        const tasks = await this.locators.taskItems.all();
        for (const task of tasks) {
            const text = await task.locator('.task-text').textContent();
            if (text.trim() === taskText.trim()) {
                return true;
            }
        }
        return false;
    }

    /**
     * Verifica se uma notificação de erro está visível
     * @returns {Promise<boolean>} Se há notificação de erro
     */
    async hasErrorNotification() {
        try {
            await this.locators.errorNotification.waitFor({ state: 'visible', timeout: 2000 });
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Verifica se uma notificação de sucesso está visível
     * @returns {Promise<boolean>} Se há notificação de sucesso
     */
    async hasSuccessNotification() {
        try {
            await this.locators.successNotification.waitFor({ state: 'visible', timeout: 2000 });
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Obtém todas as tarefas como array de objetos
     * @returns {Promise<Array>} Lista de tarefas com texto e status
     */
    async getAllTasks() {
        const count = await this.getTaskCount();
        const tasks = [];
        
        for (let i = 0; i < count; i++) {
            tasks.push({
                text: await this.getTaskText(i),
                completed: await this.isTaskCompleted(i),
                index: i
            });
        }
        
        return tasks;
    }
}

module.exports = { TodoAssertions };
