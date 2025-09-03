import { Task } from '../models/Task.js';
import { TaskRepository } from '../repositories/TaskRepository.js';
import { validateTaskText, validateTaskDuplicate, validateTaskId, sanitizeText } from '../utils/validation.js';
import { APP_CONFIG } from '../constants/appConfig.js';

/**
 * Serviço principal para gerenciamento de tarefas
 * @class TodoService
 */
export class TodoService {
    /**
     * Cria uma nova instância do serviço
     */
    constructor() {
        /** @type {Task[]} Lista de tarefas */
        this.tasks = [];

        /** @type {TaskRepository} Repositório para persistência */
        this.repository = new TaskRepository();

        this.loadTasks();
    }

    /**
     * Adiciona uma nova tarefa
     * @param {string} text - Texto da tarefa
     * @returns {Task|null} Tarefa criada ou null se inválida
     * @throws {Error} Quando a validação falha
     */
    addTask(text) {
        const validation = validateTaskText(text);
        if (!validation.isValid) {
            throw new Error(validation.error);
        }

        // Verifica se a tarefa já existe
        const duplicateValidation = validateTaskDuplicate(text, this.tasks);
        if (!duplicateValidation.isValid) {
            throw new Error(duplicateValidation.error);
        }

        const sanitizedText = sanitizeText(text);
        const task = new Task(sanitizedText);
        this.tasks.push(task);
        this.saveTasks();
        return task;
    }

    /**
     * Remove uma tarefa pelo ID
     * @param {number} taskId - ID da tarefa a ser removida
     * @returns {boolean} True se a tarefa foi removida
     * @throws {Error} Quando o ID é inválido
     */
    removeTask(taskId) {
        const validation = validateTaskId(taskId);
        if (!validation.isValid) {
            throw new Error(validation.error);
        }

        const initialLength = this.tasks.length;
        this.tasks = this.tasks.filter(task => task.id !== taskId);

        if (this.tasks.length === initialLength) {
            throw new Error(APP_CONFIG.MESSAGES.ERRORS.TASK_NOT_FOUND);
        }

        this.saveTasks();
        return true;
    }

    /**
     * Alterna o status de conclusão de uma tarefa
     * @param {number} taskId - ID da tarefa
     * @returns {Task|null} Tarefa atualizada ou null se não encontrada
     * @throws {Error} Quando o ID é inválido
     */
    toggleTask(taskId) {
        const validation = validateTaskId(taskId);
        if (!validation.isValid) {
            throw new Error(validation.error);
        }

        const task = this.tasks.find(t => t.id === taskId);
        if (!task) {
            throw new Error(APP_CONFIG.MESSAGES.ERRORS.TASK_NOT_FOUND);
        }

        task.toggle();
        this.saveTasks();
        return task;
    }

    /**
     * Edita o texto de uma tarefa
     * @param {number} taskId - ID da tarefa
     * @param {string} newText - Novo texto da tarefa
     * @returns {Task|null} Tarefa atualizada ou null se não encontrada
     * @throws {Error} Quando a validação falha
     */
    editTask(taskId, newText) {
        const idValidation = validateTaskId(taskId);
        if (!idValidation.isValid) {
            throw new Error(idValidation.error);
        }

        const textValidation = validateTaskText(newText);
        if (!textValidation.isValid) {
            throw new Error(textValidation.error);
        }

        const task = this.tasks.find(t => t.id === taskId);
        if (!task) {
            throw new Error(APP_CONFIG.MESSAGES.ERRORS.TASK_NOT_FOUND);
        }

        const sanitizedText = sanitizeText(newText);
        task.updateText(sanitizedText);
        this.saveTasks();
        return task;
    }

    /**
     * Retorna todas as tarefas
     * @returns {Task[]} Cópia do array de tarefas
     */
    getAllTasks() {
        return [...this.tasks];
    }

    /**
     * Retorna apenas tarefas pendentes
     * @returns {Task[]} Array de tarefas pendentes
     */
    getPendingTasks() {
        return this.tasks.filter(task => !task.completed);
    }

    /**
     * Retorna apenas tarefas concluídas
     * @returns {Task[]} Array de tarefas concluídas
     */
    getCompletedTasks() {
        return this.tasks.filter(task => task.completed);
    }

    /**
     * Retorna estatísticas das tarefas
     * @returns {Object} Objeto com estatísticas
     * @returns {number} returns.total - Total de tarefas
     * @returns {number} returns.completed - Tarefas concluídas
     * @returns {number} returns.pending - Tarefas pendentes
     */
    getStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;

        return { total, completed, pending };
    }

    /**
     * Salva as tarefas no repositório
     * @private
     */
    saveTasks() {
        try {
            this.repository.save(this.tasks);
        } catch (error) {
            console.error('Erro ao salvar tarefas:', error);
            throw error;
        }
    }

    /**
     * Carrega as tarefas do repositório
     * @private
     */
    loadTasks() {
        try {
            this.tasks = this.repository.load();
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
            this.tasks = [];
        }
    }
}
