import { APP_CONFIG } from '../constants/appConfig.js';

/**
 * Sistema de notificações para feedback do usuário
 * @class NotificationSystem
 */
export class NotificationSystem {
    /**
     * Cria uma nova instância do sistema de notificações
     */
    constructor() {
        this.notifications = [];
        this.container = this.createContainer();
    }

    /**
     * Cria o container para as notificações
     * @private
     * @returns {HTMLElement} Container das notificações
     */
    createContainer() {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'fixed top-4 right-4 z-50 space-y-2';
            container.setAttribute('data-testid', 'notification-container');
            document.body.appendChild(container);
        }
        return container;
    }

    /**
     * Exibe uma notificação de sucesso
     * @param {string} message - Mensagem a ser exibida
     * @param {number} duration - Duração em ms (padrão: 3000)
     */
    showSuccess(message, duration = 3000) {
        this.show(message, 'success', duration);
    }

    /**
     * Exibe uma notificação de erro
     * @param {string} message - Mensagem a ser exibida
     * @param {number} duration - Duração em ms (padrão: 5000)
     */
    showError(message, duration = 5000) {
        this.show(message, 'error', duration);
    }

    /**
     * Exibe uma notificação de informação
     * @param {string} message - Mensagem a ser exibida
     * @param {number} duration - Duração em ms (padrão: 3000)
     */
    showInfo(message, duration = 3000) {
        this.show(message, 'info', duration);
    }

    /**
     * Exibe uma notificação
     * @private
     * @param {string} message - Mensagem
     * @param {string} type - Tipo da notificação (success, error, info)
     * @param {number} duration - Duração em ms
     */
    show(message, type = 'info', duration = 3000) {
        const notification = this.createNotification(message, type);
        this.container.appendChild(notification);
        this.notifications.push(notification);

        // Animação de entrada
        setTimeout(() => {
            notification.classList.add('translate-x-0', 'opacity-100');
            notification.classList.remove('translate-x-full', 'opacity-0');
        }, 10);

        // Auto-remover após duração especificada
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification);
            }, duration);
        }

        return notification;
    }

    /**
     * Cria o elemento HTML da notificação
     * @private
     * @param {string} message - Mensagem da notificação
     * @param {string} type - Tipo da notificação
     * @returns {HTMLElement} Elemento da notificação
     */
    createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `
            ${APP_CONFIG.CSS_CLASSES.NOTIFICATION}
            transform translate-x-full opacity-0
            ${this.getTypeClasses(type)}
            min-w-[300px] max-w-[400px]
        `.trim();

        notification.setAttribute('data-testid', APP_CONFIG.TEST_IDS.NOTIFICATION);
        notification.setAttribute('data-type', type);

        const icon = this.getTypeIcon(type);

        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="text-lg">${icon}</span>
                <span class="flex-1 text-sm font-medium">${message}</span>
                <button 
                    class="text-gray-500 hover:text-gray-700 ml-2"
                    onclick="this.parentElement.parentElement.remove()"
                    data-testid="notification-close"
                >
                    ✕
                </button>
            </div>
        `;

        return notification;
    }

    /**
     * Retorna as classes CSS para cada tipo de notificação
     * @private
     * @param {string} type - Tipo da notificação
     * @returns {string} Classes CSS
     */
    getTypeClasses(type) {
        switch (type) {
            case 'success':
                return APP_CONFIG.CSS_CLASSES.SUCCESS_FEEDBACK;
            case 'error':
                return APP_CONFIG.CSS_CLASSES.ERROR_FEEDBACK;
            default:
                return 'bg-blue-100 border-blue-300 text-blue-800';
        }
    }

    /**
     * Retorna o ícone para cada tipo de notificação
     * @private
     * @param {string} type - Tipo da notificação
     * @returns {string} Emoji do ícone
     */
    getTypeIcon(type) {
        switch (type) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            default:
                return 'ℹ️';
        }
    }

    /**
     * Remove uma notificação
     * @param {HTMLElement} notification - Elemento da notificação
     */
    remove(notification) {
        if (notification && notification.parentElement) {
            // Animação de saída
            notification.classList.add('translate-x-full', 'opacity-0');
            notification.classList.remove('translate-x-0', 'opacity-100');

            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
                this.notifications = this.notifications.filter(n => n !== notification);
            }, 300);
        }
    }

    /**
     * Remove todas as notificações
     */
    clearAll() {
        this.notifications.forEach(notification => {
            this.remove(notification);
        });
    }
}
