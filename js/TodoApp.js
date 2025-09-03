import { TodoService } from './services/TodoService.js';
import { TodoUI } from './ui/TodoUI.js';

/**
 * Classe principal da aplicação Todo
 * Coordena a inicialização e comunicação entre serviços e UI
 * @class TodoApp
 */
export class TodoApp {
    /**
     * Cria e inicializa a aplicação Todo
     */
    constructor() {
        /** @type {TodoService} Serviço principal para gerenciamento de tarefas */
        this.todoService = new TodoService();

        /** @type {TodoUI} Interface do usuário */
        this.ui = new TodoUI(this.todoService);

        console.log('TodoApp inicializada com sucesso');
    }

    /**
     * Retorna o serviço de tarefas (útil para testes)
     * @returns {TodoService} Instância do serviço
     */
    getService() {
        return this.todoService;
    }

    /**
     * Retorna a interface do usuário (útil para testes)
     * @returns {TodoUI} Instância da UI
     */
    getUI() {
        return this.ui;
    }
}
