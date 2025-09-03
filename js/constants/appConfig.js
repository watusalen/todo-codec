/**
 * Configurações centralizadas da aplicação Todo
 * @module AppConfig
 */

export const APP_CONFIG = {
    // Configurações de persistência
    STORAGE: {
        KEY: 'todoList',
        VERSION: '1.0.0'
    },

    // Configurações de UI
    UI: {
        ANIMATIONS: {
            DURATION: 300,
            FADE_IN: 'animate-fade-in',
            SLIDE_IN: 'animate-slide-in'
        },
        DEBOUNCE_DELAY: 300,
        AUTO_FOCUS_DELAY: 100
    },

    // Configurações de validação
    VALIDATION: {
        MIN_TASK_LENGTH: 1,
        MAX_TASK_LENGTH: 500,
        REQUIRED_FIELDS: ['text']
    },

    // Mensagens de feedback
    MESSAGES: {
        EMPTY_STATES: {
            ALL: {
                icon: '',
                text: 'Sua lista está vazia',
                subtext: 'Adicione sua primeira tarefa acima'
            },
            PENDING: {
                icon: '',
                text: 'Parabéns! Nenhuma tarefa pendente',
                subtext: 'Você está em dia com tudo!'
            },
            COMPLETED: {
                icon: '',
                text: 'Nenhuma tarefa concluída ainda',
                subtext: 'Complete algumas tarefas para vê-las aqui'
            }
        },
        LOADING: {
            SAVING: 'Salvando...',
            LOADING: 'Carregando...',
            DELETING: 'Removendo...',
            UPDATING: 'Atualizando...'
        },
        KEYBOARD_SHORTCUTS: {
            ENTER_TO_ADD: 'Pressione Enter para adicionar',
            ENTER_TO_SAVE: 'Enter para salvar, Esc para cancelar',
            DOUBLE_CLICK_EDIT: 'Clique duplo para editar'
        },
        ERRORS: {
            TASK_TOO_SHORT: 'A tarefa deve ter pelo menos 1 caractere',
            TASK_TOO_LONG: 'A tarefa não pode ter mais de 500 caracteres',
            TASK_NOT_FOUND: 'Tarefa não encontrada',
            SAVE_ERROR: 'Erro ao salvar a tarefa',
            LOAD_ERROR: 'Erro ao carregar as tarefas'
        },
        SUCCESS: {
            TASK_ADDED: 'Tarefa adicionada com sucesso',
            TASK_UPDATED: 'Tarefa atualizada com sucesso',
            TASK_DELETED: 'Tarefa removida com sucesso',
            TASK_COMPLETED: 'Tarefa marcada como concluída',
            TASK_UNCOMPLETED: 'Tarefa marcada como pendente'
        }
    },

    // Filtros disponíveis
    FILTERS: {
        ALL: 'all',
        PENDING: 'pending',
        COMPLETED: 'completed'
    },

    // Classes CSS para estados
    CSS_CLASSES: {
        FILTER_ACTIVE: 'filter-tab flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 border-blue-600 text-blue-600',
        FILTER_INACTIVE: 'filter-tab flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-all duration-200',
        TASK_COMPLETED: 'bg-green-50 border-green-200',
        TASK_PENDING: 'bg-white',
        TASK_EDITING: 'bg-blue-50 animate-slide-in',
        LOADING: ['opacity-50', 'pointer-events-none'],
        SUCCESS_FEEDBACK: 'bg-green-100 border-green-300 text-green-800',
        ERROR_FEEDBACK: 'bg-red-100 border-red-300 text-red-800',
        NOTIFICATION: 'fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300'
    },

    // Seletores para testes
    TEST_IDS: {
        TASK_INPUT: 'task-input',
        ADD_BUTTON: 'add-button',
        TASK_LIST: 'task-list',
        EMPTY_STATE: 'empty-state',
        FILTER_ALL: 'filter-all',
        FILTER_PENDING: 'filter-pending',
        FILTER_COMPLETED: 'filter-completed',
        TOTAL_TASKS: 'total-tasks',
        COMPLETED_TASKS: 'completed-tasks',
        PENDING_TASKS: 'pending-tasks',
        LOADING_STATE: 'loading-state',
        NOTIFICATION: 'notification',
        CONFIRM_DIALOG: 'confirm-dialog',
        CONFIRM_YES: 'confirm-yes',
        CONFIRM_NO: 'confirm-no'
    },

    // Configurações de teclado
    KEYBOARD: {
        ENTER: 'Enter',
        ESCAPE: 'Escape',
        DELETE: 'Delete'
    }
};
