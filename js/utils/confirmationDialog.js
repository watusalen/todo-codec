import { APP_CONFIG } from '../constants/appConfig.js';

/**
 * Sistema de diálogos de confirmação
 * @class ConfirmationDialog
 */
export class ConfirmationDialog {
    /**
     * Cria uma nova instância do sistema de confirmação
     */
    constructor() {
        this.activeDialog = null;
    }

    /**
     * Mostra um diálogo de confirmação
     * @param {string} message - Mensagem de confirmação
     * @param {Object} options - Opções do diálogo
     * @param {string} options.title - Título do diálogo (padrão: 'Confirmação')
     * @param {string} options.confirmText - Texto do botão confirmar (padrão: 'Sim')
     * @param {string} options.cancelText - Texto do botão cancelar (padrão: 'Não')
     * @param {string} options.type - Tipo do diálogo: 'danger', 'warning', 'info' (padrão: 'warning')
     * @returns {Promise<boolean>} Promise que resolve com true se confirmado, false se cancelado
     */
    async show(message, options = {}) {
        const config = {
            title: 'Confirmação',
            confirmText: 'Sim',
            cancelText: 'Não',
            type: 'warning',
            ...options
        };

        return new Promise((resolve) => {
            // Remove diálogo ativo se existir
            if (this.activeDialog) {
                this.remove();
            }

            this.activeDialog = this.createDialog(message, config, resolve);
            document.body.appendChild(this.activeDialog);

            // Foca no botão cancelar por padrão (mais seguro)
            setTimeout(() => {
                const cancelButton = this.activeDialog.querySelector('[data-testid="confirm-no"]');
                if (cancelButton) {
                    cancelButton.focus();
                }
            }, 100);
        });
    }

    /**
     * Cria o elemento HTML do diálogo
     * @private
     * @param {string} message - Mensagem do diálogo
     * @param {Object} config - Configuração do diálogo
     * @param {Function} resolve - Função de resolução da Promise
     * @returns {HTMLElement} Elemento do diálogo
     */
    createDialog(message, config, resolve) {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in';
        overlay.setAttribute('data-testid', APP_CONFIG.TEST_IDS.CONFIRM_DIALOG);

        const dialog = document.createElement('div');
        dialog.className = 'bg-white rounded-lg shadow-xl p-6 max-w-md mx-4 animate-slide-in';

        const iconColor = this.getIconColor(config.type);
        const confirmButtonClass = this.getConfirmButtonClass(config.type);

        dialog.innerHTML = `
            <div class="flex items-center gap-3 mb-4">
                <div class="w-8 h-8 rounded-full flex items-center justify-center ${iconColor}">
                    ${this.getIcon(config.type)}
                </div>
                <h3 class="text-lg font-semibold text-gray-900">${config.title}</h3>
            </div>
            
            <p class="text-gray-600 mb-6 leading-relaxed">${message}</p>
            
            <div class="flex gap-3 justify-end">
                <button 
                    class="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200 font-medium"
                    data-testid="${APP_CONFIG.TEST_IDS.CONFIRM_NO}"
                >
                    ${config.cancelText}
                </button>
                <button 
                    class="px-4 py-2 text-white rounded-md transition-colors duration-200 font-medium ${confirmButtonClass}"
                    data-testid="${APP_CONFIG.TEST_IDS.CONFIRM_YES}"
                >
                    ${config.confirmText}
                </button>
            </div>
        `;

        overlay.appendChild(dialog);

        // Event listeners
        this.attachEventListeners(overlay, resolve);

        return overlay;
    }

    /**
     * Anexa event listeners ao diálogo
     * @private
     * @param {HTMLElement} overlay - Elemento do overlay
     * @param {Function} resolve - Função de resolução
     */
    attachEventListeners(overlay, resolve) {
        const confirmButton = overlay.querySelector('[data-testid="confirm-yes"]');
        const cancelButton = overlay.querySelector('[data-testid="confirm-no"]');

        // Botão confirmar
        confirmButton.addEventListener('click', () => {
            this.remove();
            resolve(true);
        });

        // Botão cancelar
        cancelButton.addEventListener('click', () => {
            this.remove();
            resolve(false);
        });

        // Clique fora do diálogo
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.remove();
                resolve(false);
            }
        });

        // Teclas do teclado
        const handleKeyDown = (e) => {
            switch (e.key) {
                case APP_CONFIG.KEYBOARD.ENTER:
                    e.preventDefault();
                    this.remove();
                    resolve(true);
                    break;
                case APP_CONFIG.KEYBOARD.ESCAPE:
                    e.preventDefault();
                    this.remove();
                    resolve(false);
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        // Remove listener quando o diálogo for removido
        overlay.addEventListener('remove', () => {
            document.removeEventListener('keydown', handleKeyDown);
        });
    }

    /**
     * Retorna a cor do ícone baseada no tipo
     * @private
     * @param {string} type - Tipo do diálogo
     * @returns {string} Classes CSS para a cor
     */
    getIconColor(type) {
        switch (type) {
            case 'danger':
                return 'bg-red-100 text-red-600';
            case 'warning':
                return 'bg-yellow-100 text-yellow-600';
            case 'info':
                return 'bg-blue-100 text-blue-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    }

    /**
     * Retorna o ícone baseado no tipo
     * @private
     * @param {string} type - Tipo do diálogo
     * @returns {string} Emoji do ícone
     */
    getIcon(type) {
        switch (type) {
            case 'danger':
                return '⚠️';
            case 'warning':
                return '❓';
            case 'info':
                return 'ℹ️';
            default:
                return '❓';
        }
    }

    /**
     * Retorna a classe do botão de confirmação baseada no tipo
     * @private
     * @param {string} type - Tipo do diálogo
     * @returns {string} Classes CSS do botão
     */
    getConfirmButtonClass(type) {
        switch (type) {
            case 'danger':
                return 'bg-red-600 hover:bg-red-700';
            case 'warning':
                return 'bg-yellow-600 hover:bg-yellow-700';
            case 'info':
                return 'bg-blue-600 hover:bg-blue-700';
            default:
                return 'bg-gray-600 hover:bg-gray-700';
        }
    }

    /**
     * Remove o diálogo ativo
     */
    remove() {
        if (this.activeDialog) {
            this.activeDialog.dispatchEvent(new Event('remove'));
            this.activeDialog.remove();
            this.activeDialog = null;
        }
    }

    /**
     * Métodos de conveniência para tipos específicos
     */

    /**
     * Mostra um diálogo de confirmação de exclusão
     * @param {string} itemName - Nome do item a ser excluído
     * @returns {Promise<boolean>}
     */
    async confirmDelete(itemName = 'este item') {
        return this.show(
            `Tem certeza que deseja excluir esta? Esta ação não pode ser desfeita.`,
            {
                title: 'Confirmar Exclusão',
                confirmText: 'Excluir',
                cancelText: 'Cancelar',
                type: 'danger'
            }
        );
    }
}
