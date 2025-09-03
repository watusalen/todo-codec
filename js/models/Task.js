/**
 * Modelo da Tarefa - representa uma única tarefa no sistema
 * @class Task
 */
export class Task {
    /**
     * Cria uma nova tarefa
     * @param {string} text - Texto da tarefa
     */
    constructor(text) {
        /** @type {number} ID único da tarefa */
        this.id = Date.now() + Math.random();

        /** @type {string} Texto da tarefa */
        this.text = text;

        /** @type {boolean} Status de conclusão da tarefa */
        this.completed = false;

        /** @type {Date} Data de criação da tarefa */
        this.createdAt = new Date();
    }

    /**
     * Alterna o status de conclusão da tarefa
     * @returns {boolean} Novo status da tarefa
     */
    toggle() {
        this.completed = !this.completed;
        return this.completed;
    }

    /**
     * Atualiza o texto da tarefa
     * @param {string} newText - Novo texto da tarefa
     */
    updateText(newText) {
        this.text = newText;
    }
}
