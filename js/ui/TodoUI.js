import { APP_CONFIG } from '../constants/appConfig.js';
import { validateFilter } from '../utils/validation.js';
import { NotificationSystem } from '../utils/notifications.js';
import { ConfirmationDialog } from '../utils/confirmationDialog.js';

/**
 * Interface do usuário para a aplicação Todo
 * @class TodoUI
 */
export class TodoUI {
    /**
     *         return `
            <div class="flex items-center gap-3 p-4 border border-gray-200 rounded-lg mb-3 hover:bg-gray-50 transition-all duration-200 ${APP_CONFIG.UI.ANIMATIONS.SLIDE_IN} ${taskStateClass}" data-task-id="${task.id}" data-testid="task-item-${task.id}">`ia uma nova instância da interface
     * @param {TodoService} todoService - Serviço de tarefas
     */
    constructor(todoService) {
        /** @type {TodoService} Serviço principal */
        this.todoService = todoService;

        /** @type {string} Filtro atual */
        this.currentFilter = APP_CONFIG.FILTERS.ALL;

        /** @type {number|null} ID da tarefa sendo editada */
        this.editingTaskId = null;

        /** @type {boolean} Estado de loading */
        this.isLoading = false;

        // Sistemas auxiliares
        /** @type {NotificationSystem} Sistema de notificações */
        this.notifications = new NotificationSystem();

        /** @type {ConfirmationDialog} Sistema de confirmação */
        this.confirmDialog = new ConfirmationDialog();

        // Elementos DOM
        this.initializeDOMElements();
        this.setupEventListeners();
        this.render();
    }

    /**
     * Inicializa as referências dos elementos DOM
     * @private
     */
    initializeDOMElements() {
        this.taskInput = document.getElementById('taskInput');
        this.addButton = document.getElementById('addButton');
        this.taskList = document.getElementById('taskList');
        this.totalTasks = document.getElementById('totalTasks');
        this.completedTasks = document.getElementById('completedTasks');
        this.pendingTasks = document.getElementById('pendingTasks');
        this.filterTabs = document.querySelectorAll('.filter-tab');

        // Adiciona placeholders e títulos
        if (this.taskInput) {
            this.taskInput.placeholder = 'O que você precisa fazer hoje?';
            this.taskInput.title = APP_CONFIG.MESSAGES.KEYBOARD_SHORTCUTS.ENTER_TO_ADD;
        }
    }

    /**
     * Configura todos os event listeners
     * @private
     */
    setupEventListeners() {
        // Eventos do input e botão adicionar
        if (this.addButton) {
            this.addButton.addEventListener('click', () => {
                this.handleAddTask();
            });
        }

        if (this.taskInput) {
            this.taskInput.addEventListener('keypress', (e) => {
                if (e.key === APP_CONFIG.KEYBOARD.ENTER) {
                    this.handleAddTask();
                }
            });

            // Auto-save durante digitação (debounced)
            let debounceTimer;
            this.taskInput.addEventListener('input', () => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    // Aqui poderia implementar auto-complete ou validação em tempo real
                }, APP_CONFIG.UI.DEBOUNCE_DELAY);
            });
        }

        // Eventos dos filtros
        this.filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.setFilter(tab.dataset.filter);
            });
        });

        // Atalhos de teclado globais
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeyboard(e);
        });
    }

    /**
     * Manipula atalhos de teclado globais
     * @private
     * @param {KeyboardEvent} e - Evento do teclado
     */
    handleGlobalKeyboard(e) {
        // Ctrl/Cmd + Enter para focar no input
        if ((e.ctrlKey || e.metaKey) && e.key === APP_CONFIG.KEYBOARD.ENTER) {
            e.preventDefault();
            if (this.taskInput) {
                this.taskInput.focus();
            }
        }

        // Escape para cancelar edição
        if (e.key === APP_CONFIG.KEYBOARD.ESCAPE && this.editingTaskId) {
            this.cancelEdit();
        }
    }

    /**
     * Define o filtro atual
     * @param {string} filter - Novo filtro
     */
    async setFilter(filter) {
        try {
            const validation = validateFilter(filter);
            if (!validation.isValid) {
                this.notifications.showError(validation.error);
                return;
            }

            this.currentFilter = filter;
            this.updateFilterTabs();
            await this.render();

        } catch (error) {
            console.error('Erro ao aplicar filtro:', error);
            this.notifications.showError('Erro ao aplicar filtro');
        }
    }

    /**
     * Atualiza o visual das abas de filtro
     * @private
     */
    updateFilterTabs() {
        this.filterTabs.forEach(tab => {
            if (tab.dataset.filter === this.currentFilter) {
                tab.className = APP_CONFIG.CSS_CLASSES.FILTER_ACTIVE;
            } else {
                tab.className = APP_CONFIG.CSS_CLASSES.FILTER_INACTIVE;
            }
        });
    }

    /**
     * Manipula a adição de uma nova tarefa
     * @private
     */
    async handleAddTask() {
        if (this.isLoading) return;

        const text = this.taskInput?.value?.trim();
        if (!text) {
            this.notifications.showError('Digite uma tarefa antes de adicionar');
            return;
        }

        try {
            this.setLoading(true);

            const task = this.todoService.addTask(text);

            if (task) {
                this.taskInput.value = '';
                this.notifications.showSuccess(APP_CONFIG.MESSAGES.SUCCESS.TASK_ADDED);
                await this.render();

                // Foca de volta no input
                setTimeout(() => {
                    this.taskInput?.focus();
                }, APP_CONFIG.UI.AUTO_FOCUS_DELAY);
            }

        } catch (error) {
            console.error('Erro ao adicionar tarefa:', error);
            this.notifications.showError(error.message || 'Erro ao adicionar tarefa');
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Define o estado de loading
     * @private
     * @param {boolean} loading - Estado de loading
     */
    setLoading(loading) {
        this.isLoading = loading;

        if (this.addButton) {
            this.addButton.disabled = loading;
            this.addButton.textContent = loading ?
                APP_CONFIG.MESSAGES.LOADING.SAVING : 'Adicionar';
        }

        if (this.taskInput) {
            this.taskInput.disabled = loading;
        }

        // Adiciona classe de loading visual
        const mainCard = document.querySelector('.bg-white.rounded-2xl');
        if (mainCard) {
            const loadingClasses = APP_CONFIG.CSS_CLASSES.LOADING;
            if (loading) {
                mainCard.classList.add(...loadingClasses);
            } else {
                mainCard.classList.remove(...loadingClasses);
            }
        }
    }

    /**
     * Renderiza a interface
     * @returns {Promise<void>}
     */
    async render() {
        try {
            await this.renderTasks();
            this.renderStats();
        } catch (error) {
            console.error('Erro ao renderizar interface:', error);
            this.notifications.showError('Erro ao atualizar a interface');
        }
    }

    /**
     * Renderiza a lista de tarefas
     * @private
     * @returns {Promise<void>}
     */
    async renderTasks() {
        if (!this.taskList) return;

        let tasks;
        let emptyMessage;

        try {
            switch (this.currentFilter) {
                case APP_CONFIG.FILTERS.PENDING:
                    tasks = this.todoService.getPendingTasks();
                    emptyMessage = APP_CONFIG.MESSAGES.EMPTY_STATES.PENDING;
                    break;
                case APP_CONFIG.FILTERS.COMPLETED:
                    tasks = this.todoService.getCompletedTasks();
                    emptyMessage = APP_CONFIG.MESSAGES.EMPTY_STATES.COMPLETED;
                    break;
                default:
                    tasks = this.todoService.getAllTasks();
                    emptyMessage = APP_CONFIG.MESSAGES.EMPTY_STATES.ALL;
            }

            if (tasks.length === 0) {
                this.renderEmptyState(emptyMessage);
                return;
            }

            this.taskList.innerHTML = tasks
                .map(task => this.createTaskHTML(task))
                .join('');

            await this.attachTaskEvents();

        } catch (error) {
            console.error('Erro ao renderizar tarefas:', error);
            this.renderErrorState();
        }
    }

    /**
     * Renderiza o estado vazio
     * @private
     * @param {Object} emptyMessage - Configuração da mensagem vazia
     */
    renderEmptyState(emptyMessage) {
        this.taskList.innerHTML = `
            <div class="flex flex-col items-center justify-center py-12 text-center ${APP_CONFIG.UI.ANIMATIONS.FADE_IN}" data-testid="${APP_CONFIG.TEST_IDS.EMPTY_STATE}">
                <div class="text-6xl mb-4">${emptyMessage.icon}</div>
                <div class="text-lg font-medium text-gray-800 mb-2">${emptyMessage.text}</div>
                <div class="text-gray-500">${emptyMessage.subtext}</div>
            </div>
        `;
    }

    /**
     * Renderiza o estado de erro
     * @private
     */
    renderErrorState() {
        this.taskList.innerHTML = `
            <div class="flex flex-col items-center justify-center py-12 text-center" data-testid="error-state">
                <div class="text-6xl mb-4">❌</div>
                <div class="text-lg font-medium text-red-600 mb-2">Erro ao carregar tarefas</div>
                <div class="text-gray-500">Tente recarregar a página</div>
                <button 
                    class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onclick="location.reload()"
                >
                    Recarregar
                </button>
            </div>
        `;
    }

    /**
     * Cria o HTML para uma tarefa
     * @private
     * @param {Task} task - Tarefa para renderizar
     * @returns {string} HTML da tarefa
     */
    createTaskHTML(task) {
        const isEditing = this.editingTaskId === task.id;
        const taskStateClass = task.completed ?
            APP_CONFIG.CSS_CLASSES.TASK_COMPLETED :
            APP_CONFIG.CSS_CLASSES.TASK_PENDING;

        if (isEditing) {
            return `
                <div class="flex items-center gap-3 p-4 border border-gray-200 rounded-lg mb-3 ${APP_CONFIG.CSS_CLASSES.TASK_EDITING}" data-task-id="${task.id}">
                    <input 
                        type="checkbox" 
                        class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                        data-testid="task-checkbox-${task.id}"
                        ${task.completed ? 'checked' : ''}
                    >
                    <input 
                        type="text" 
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        data-testid="task-edit-input-${task.id}"
                        value="${task.text}"
                        placeholder="Digite o texto da tarefa..."
                        maxlength="${APP_CONFIG.VALIDATION.MAX_TASK_LENGTH}"
                    >
                    <div class="flex gap-2">
                        <button 
                            class="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors duration-200" 
                            data-testid="save-button-${task.id}"
                            title="Salvar alterações"
                        >
                            Salvar
                        </button>
                        <button 
                            class="px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition-colors duration-200" 
                            data-testid="cancel-button-${task.id}"
                            title="Cancelar edição"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            `;
        }

        return `
            <div class="flex items-center gap-3 p-4 border border-gray-200 rounded-lg mb-3 hover:bg-gray-50 transition-all duration-200 ${APP_CONFIG.UI.ANIMATIONS.SLIDE_IN} ${taskStateClass}" data-task-id="${task.id}">
                <input 
                    type="checkbox" 
                    class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                    data-testid="task-checkbox-${task.id}"
                    ${task.completed ? 'checked' : ''}
                    title="${task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}"
                >
                <span 
                    class="flex-1 text-gray-800 cursor-pointer ${task.completed ? 'line-through text-gray-500' : ''}" 
                    data-testid="task-text-${task.id}"
                    title="${APP_CONFIG.MESSAGES.KEYBOARD_SHORTCUTS.DOUBLE_CLICK_EDIT}"
                >${task.text}</span>
                <div class="flex gap-2">
                    <button 
                        class="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200" 
                        data-testid="edit-button-${task.id}"
                        title="Editar tarefa"
                    >
                        Editar
                    </button>
                    <button 
                        class="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors duration-200" 
                        data-testid="delete-button-${task.id}"
                        title="Excluir tarefa"
                    >
                        Excluir
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Anexa event listeners às tarefas renderizadas
     * @private
     * @returns {Promise<void>}
     */
    async attachTaskEvents() {
        // Eventos de checkbox
        document.querySelectorAll('[data-testid^="task-checkbox-"]').forEach(checkbox => {
            checkbox.addEventListener('change', async (e) => {
                await this.handleToggleTask(e);
            });
        });

        // Eventos de deletar
        document.querySelectorAll('[data-testid^="delete-button-"]').forEach(button => {
            button.addEventListener('click', async (e) => {
                await this.handleDeleteTask(e);
            });
        });

        // Eventos de edição
        document.querySelectorAll('[data-testid^="edit-button-"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const taskId = parseFloat(e.target.closest('[data-task-id]').dataset.taskId);
                this.startEditing(taskId);
            });
        });

        // Duplo clique no texto da tarefa
        document.querySelectorAll('[data-testid^="task-text-"]').forEach(text => {
            text.addEventListener('dblclick', (e) => {
                const taskId = parseFloat(e.target.closest('[data-task-id]').dataset.taskId);
                this.startEditing(taskId);
            });
        });

        // Eventos do modo de edição
        document.querySelectorAll('[data-testid^="save-button-"]').forEach(button => {
            button.addEventListener('click', async (e) => {
                const taskId = parseFloat(e.target.closest('[data-task-id]').dataset.taskId);
                await this.saveEdit(taskId);
            });
        });

        document.querySelectorAll('[data-testid^="cancel-button-"]').forEach(button => {
            button.addEventListener('click', () => {
                this.cancelEdit();
            });
        });

        // Eventos de teclado nos inputs de edição
        document.querySelectorAll('[data-testid^="task-edit-input-"]').forEach(input => {
            input.addEventListener('keypress', async (e) => {
                if (e.key === APP_CONFIG.KEYBOARD.ENTER) {
                    const taskId = parseFloat(e.target.closest('[data-task-id]').dataset.taskId);
                    await this.saveEdit(taskId);
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === APP_CONFIG.KEYBOARD.ESCAPE) {
                    this.cancelEdit();
                }
            });

            // Auto-focus e seleção do texto
            setTimeout(() => {
                input.focus();
                input.select();
            }, APP_CONFIG.UI.AUTO_FOCUS_DELAY);

            // Adiciona título com dica
            input.title = APP_CONFIG.MESSAGES.KEYBOARD_SHORTCUTS.ENTER_TO_SAVE;
        });
    }

    /**
     * Manipula o toggle de status da tarefa
     * @private
     * @param {Event} e - Evento do checkbox
     */
    async handleToggleTask(e) {
        try {
            const taskId = parseFloat(e.target.closest('[data-task-id]').dataset.taskId);
            const task = this.todoService.toggleTask(taskId);

            if (task) {
                const message = task.completed ?
                    APP_CONFIG.MESSAGES.SUCCESS.TASK_COMPLETED :
                    APP_CONFIG.MESSAGES.SUCCESS.TASK_UNCOMPLETED;

                this.notifications.showSuccess(message);
                await this.render();
            }

        } catch (error) {
            console.error('Erro ao alterar status da tarefa:', error);
            this.notifications.showError(error.message || 'Erro ao alterar status da tarefa');
            // Reverte o checkbox
            e.target.checked = !e.target.checked;
        }
    }

    /**
     * Manipula a exclusão de tarefa com confirmação
     * @private
     * @param {Event} e - Evento do botão de exclusão
     */
    async handleDeleteTask(e) {
        try {
            const taskId = parseFloat(e.target.closest('[data-task-id]').dataset.taskId);
            const taskElement = e.target.closest('[data-task-id]');
            const taskText = taskElement.querySelector('[data-testid^="task-text-"]')?.textContent || 'esta tarefa';

            const confirmed = await this.confirmDialog.confirmDelete(taskText);

            if (confirmed) {
                this.todoService.removeTask(taskId);
                this.notifications.showSuccess(APP_CONFIG.MESSAGES.SUCCESS.TASK_DELETED);
                await this.render();
            }

        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
            this.notifications.showError(error.message || 'Erro ao excluir tarefa');
        }
    }

    /**
     * Inicia o modo de edição para uma tarefa
     * @param {number} taskId - ID da tarefa a ser editada
     */
    startEditing(taskId) {
        this.editingTaskId = taskId;
        this.render();
    }

    /**
     * Salva a edição da tarefa
     * @private
     * @param {number} taskId - ID da tarefa
     */
    async saveEdit(taskId) {
        try {
            const input = document.querySelector(`[data-testid="task-edit-input-${taskId}"]`);
            if (!input) return;

            const newText = input.value;
            const task = this.todoService.editTask(taskId, newText);

            if (task) {
                this.editingTaskId = null;
                this.notifications.showSuccess(APP_CONFIG.MESSAGES.SUCCESS.TASK_UPDATED);
                await this.render();
            }

        } catch (error) {
            console.error('Erro ao salvar edição:', error);
            this.notifications.showError(error.message || 'Erro ao salvar alterações');
        }
    }

    /**
     * Cancela o modo de edição
     */
    cancelEdit() {
        this.editingTaskId = null;
        this.render();
    }

    /**
     * Renderiza as estatísticas
     * @private
     */
    renderStats() {
        try {
            const stats = this.todoService.getStats();

            if (this.totalTasks) {
                this.totalTasks.textContent = stats.total;
            }
            if (this.completedTasks) {
                this.completedTasks.textContent = stats.completed;
            }
            if (this.pendingTasks) {
                this.pendingTasks.textContent = stats.pending;
            }

        } catch (error) {
            console.error('Erro ao renderizar estatísticas:', error);
        }
    }

    /**
     * Métodos públicos para acesso externo (útil para testes)
     */

    /**
     * Obtém o filtro atual
     * @returns {string} Filtro atual
     */
    getCurrentFilter() {
        return this.currentFilter;
    }

    /**
     * Obtém o ID da tarefa sendo editada
     * @returns {number|null} ID da tarefa ou null
     */
    getEditingTaskId() {
        return this.editingTaskId;
    }

    /**
     * Obtém o estado de loading
     * @returns {boolean} Estado de loading
     */
    getLoadingState() {
        return this.isLoading;
    }
}
