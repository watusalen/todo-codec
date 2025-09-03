import { Task } from '../models/Task.js';
import { APP_CONFIG } from '../constants/appConfig.js';

/**
 * Repositório para gerenciar persistência de tarefas no localStorage
 * @class TaskRepository
 */
export class TaskRepository {
    /**
     * Cria uma nova instância do repositório
     */
    constructor() {
        this.storageKey = APP_CONFIG.STORAGE.KEY;
        this.version = APP_CONFIG.STORAGE.VERSION;
    }

    /**
     * Salva uma lista de tarefas no localStorage
     * @param {Task[]} tasks - Array de tarefas para salvar
     * @throws {Error} Quando falha ao salvar no localStorage
     */
    save(tasks) {
        try {
            const data = {
                version: this.version,
                timestamp: new Date().toISOString(),
                tasks: tasks.map(task => ({
                    id: task.id,
                    text: task.text,
                    completed: task.completed,
                    createdAt: task.createdAt
                }))
            };

            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.error('Erro ao salvar tarefas:', error);
            throw new Error(APP_CONFIG.MESSAGES.ERRORS.SAVE_ERROR);
        }
    }

    /**
     * Carrega tarefas do localStorage
     * @returns {Task[]} Array de tarefas carregadas
     * @throws {Error} Quando falha ao carregar do localStorage
     */
    load() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (!data) return [];

            const parsedData = JSON.parse(data);

            // Suporte a versões antigas (retrocompatibilidade)
            const tasksData = Array.isArray(parsedData) ? parsedData : parsedData.tasks;

            return tasksData.map(taskData => {
                const task = new Task(taskData.text);
                task.id = taskData.id;
                task.completed = taskData.completed;
                task.createdAt = new Date(taskData.createdAt);
                return task;
            });
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
            throw new Error(APP_CONFIG.MESSAGES.ERRORS.LOAD_ERROR);
        }
    }

    /**
     * Limpa todos os dados do localStorage
     */
    clear() {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (error) {
            console.error('Erro ao limpar dados:', error);
        }
    }
}
