import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { TodoLocators } from './TodoLocators';

/**
 * Classe que contém todas as ações que podemos fazer na página Todo App
 * Como clicar, digitar, marcar tarefas, etc.
 * 
 * Esta classe herda de BasePage, então também tem acesso a:
 * - goto()
 * - clearLocalStorage()
 * - reload()
 * - waitForElement()
 * - waitForElementHidden()
 * 
 * @example
 * ```typescript
 * const actions = new TodoActions(page);
 * await actions.goto();
 * await actions.addTask('Comprar pão');
 * await actions.toggleTaskComplete(0);
 * ```
 */
export class TodoActions extends BasePage {
    /** Instância dos localizadores para encontrar elementos na página */
    locators: TodoLocators;

    /**
     * Cria uma nova instância das ações do Todo
     * @param page - Instância da página do Playwright
     */
    constructor(page: Page) {
        super(page);
        this.locators = new TodoLocators(page);
    }

    /**
     * Adiciona uma nova tarefa à lista
     * 
     * Passos executados:
     * 1. Preenche o campo de texto com o texto da tarefa
     * 2. Clica no botão adicionar
     * 3. Aguarda a operação ser processada
     * 
     * @param taskText - O texto da tarefa a ser adicionada
     * 
     * @example
     * ```typescript
     * await todoActions.addTask('Comprar leite');
     * await todoActions.addTask('Estudar TypeScript');
     * ```
     */
    async addTask(taskText: string) {
        await this.locators.taskInput.fill(taskText);
        await this.page.waitForTimeout(1000);
        await this.locators.addButton.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Marca ou desmarca uma tarefa como concluída
     * Se a tarefa estava pendente, marca como concluída
     * Se a tarefa estava concluída, marca como pendente
     * 
     * @param taskIndex - Índice da tarefa na lista (começa em 0)
     * 
     * @example
     * ```typescript
     * // Marca a primeira tarefa como concluída
     * await todoActions.toggleTaskComplete(0);
     * 
     * // Marca a terceira tarefa como concluída
     * await todoActions.toggleTaskComplete(2);
     * ```
     */
    async toggleTaskComplete(taskIndex: number) {
        await this.locators.checkboxes.nth(taskIndex).click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Exclui uma tarefa da lista
     * 
     * Passos executados:
     * 1. Clica no botão de excluir da tarefa
     * 2. Aguarda o modal de confirmação aparecer
     * 3. Clica em "Sim" para confirmar ou "Não" para cancelar
     * 4. Aguarda o modal desaparecer
     * 
     * @param taskIndex - Índice da tarefa na lista (começa em 0)
     * @param confirmDelete - Se true confirma a exclusão, se false cancela (padrão: true)
     * 
     * @example
     * ```typescript
     * // Exclui a primeira tarefa confirmando
     * await todoActions.deleteTask(0, true);
     * 
     * // Tenta excluir mas cancela a operação
     * await todoActions.deleteTask(0, false);
     * ```
     */
    async deleteTask(taskIndex: number, confirmDelete = true) {
        await this.locators.deleteButtons.nth(taskIndex).click();
        await this.locators.confirmDialog.waitFor({ state: 'visible' });
        await this.page.waitForTimeout(1000);

        if (confirmDelete) {
            await this.locators.confirmYesButton.click();
        } else {
            await this.locators.confirmNoButton.click();
        }
        
        await this.page.waitForTimeout(1000);
        await this.locators.confirmDialog.waitFor({ state: 'hidden' });
    }

    /**
     * Edita o texto de uma tarefa existente
     * 
     * Passos executados:
     * 1. Clica no botão de editar da tarefa
     * 2. Preenche o campo de edição com o novo texto
     * 3. Clica no botão salvar
     * 4. Aguarda a operação ser processada
     * 
     * @param taskIndex - Índice da tarefa na lista (começa em 0)
     * @param newText - Novo texto para a tarefa
     * 
     * @example
     * ```typescript
     * // Edita a primeira tarefa
     * await todoActions.editTask(0, 'Texto atualizado');
     * ```
     */
    async editTask(taskIndex: number, newText: string) {
        await this.locators.editButtons.nth(taskIndex).click();
        await this.locators.editInputs.nth(taskIndex).fill(newText);
        await this.locators.saveButtons.nth(taskIndex).click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Cancela a edição de uma tarefa
     * 
     * Passos executados:
     * 1. Clica no botão de editar da tarefa (entra no modo edição)
     * 2. Clica no botão cancelar (sai do modo edição sem salvar)
     * 
     * @param taskIndex - Índice da tarefa na lista (começa em 0)
     * 
     * @example
     * ```typescript
     * // Cancela a edição da primeira tarefa
     * await todoActions.cancelEditTask(0);
     * ```
     */
    async cancelEditTask(taskIndex: number) {
        await this.locators.editButtons.nth(taskIndex).click();
        await this.locators.cancelButtons.nth(taskIndex).click();
        await this.page.waitForTimeout(1000);
    }
}
