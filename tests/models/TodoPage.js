const { TodoAssertions } = require('./TodoAssertions');

/**
 * Page Object Model principal para o Todo App
 * Herda todas as funcionalidades dos módulos especializados
 */
class TodoPage extends TodoAssertions {
    constructor(page) {
        super(page);
        // Não expõe localizadores diretamente - acesso via this.locators ou métodos específicos
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
