import { Page } from '@playwright/test';
import { TodoActions } from './TodoActions';

/**
 * Representa uma tarefa na lista do Todo App
 */
export type Task = {
    /** O texto da tarefa */
    text: string;
    /** Se a tarefa está marcada como concluída */
    completed: boolean;
    /** Posição da tarefa na lista (começa em 0) */
    index: number;
};

/**
 * Classe que verifica se as coisas estão funcionando como esperado
 * É onde fazemos as "perguntas" para a página: quantas tarefas tem? está vazio?
 * 
 * Esta classe herda de TodoActions, então também tem acesso a:
 * - Todas as ações (addTask, deleteTask, etc.)
 * - Todos os localizadores
 * - Funcionalidades base (goto, reload, etc.)
 * 
 * @example
 * ```typescript
 * const assertions = new TodoAssertions(page);
 * await assertions.addTask('Teste');
 * 
 * const count = await assertions.getTaskCount();
 * console.log(`Total de tarefas: ${count}`);
 * 
 * const isEmpty = await assertions.isEmptyStateVisible();
 * console.log(`Lista vazia: ${isEmpty}`);
 * ```
 */
export class TodoAssertions extends TodoActions {

    /**
     * Cria uma nova instância das verificações do Todo
     * @param page - Instância da página do Playwright
     */
    constructor(page: Page) {
        super(page);
    }

    /**
     * Obtém o texto de uma tarefa específica
     * 
     * @param taskIndex - Índice da tarefa na lista (começa em 0)
     * @returns O texto da tarefa ou string vazia se não encontrar
     * 
     * @example
     * ```typescript
     * const texto = await todoAssertions.getTaskText(0);
     * console.log(`Primeira tarefa: ${texto}`);
     * ```
     */
    async getTaskText(taskIndex: number): Promise<string> {
        const text = await this.locators.taskTexts.nth(taskIndex).textContent();
        return text || '';
    }

    /**
     * Verifica se uma tarefa está marcada como concluída
     * 
     * @param taskIndex - Índice da tarefa na lista (começa em 0)
     * @returns true se a tarefa estiver concluída, false caso contrário
     * 
     * @example
     * ```typescript
     * const concluida = await todoAssertions.isTaskCompleted(0);
     * if (concluida) {
     *   console.log('A primeira tarefa está concluída');
     * }
     * ```
     */
    async isTaskCompleted(taskIndex: number): Promise<boolean> {
        return await this.locators.checkboxes.nth(taskIndex).isChecked();
    }

    /**
     * Conta quantas tarefas existem na lista
     * 
     * @returns Número total de tarefas na lista
     * 
     * @example
     * ```typescript
     * const total = await todoAssertions.getTaskCount();
     * console.log(`Existem ${total} tarefas na lista`);
     * ```
     */
    async getTaskCount(): Promise<number> {
        return await this.locators.taskItems.count();
    }

    /**
     * Verifica se a tela de "lista vazia" está sendo exibida
     * Esta tela aparece quando não há nenhuma tarefa na lista
     * 
     * @returns true se a tela vazia estiver visível, false caso contrário
     * 
     * @example
     * ```typescript
     * const vazia = await todoAssertions.isEmptyStateVisible();
     * if (vazia) {
     *   console.log('A lista está vazia');
     * }
     * ```
     */
    async isEmptyStateVisible(): Promise<boolean> {
        try {
            await this.locators.emptyState.waitFor({ state: 'visible', timeout: 1000 });
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Verifica se existe uma tarefa com um texto específico na lista
     * Útil para confirmar se uma tarefa foi adicionada com sucesso
     * 
     * @param taskText - Texto da tarefa para procurar
     * @returns true se encontrar a tarefa, false caso contrário
     * 
     * @example
     * ```typescript
     * const existe = await todoAssertions.hasTaskWithText('Comprar pão');
     * if (existe) {
     *   console.log('A tarefa "Comprar pão" existe na lista');
     * }
     * ```
     */
    async hasTaskWithText(taskText: string): Promise<boolean> {
        const tasks = await this.locators.taskItems.all();
        
        for (const task of tasks) {
            const text = await task.locator('.task-text').textContent();
            if (text?.trim() === taskText.trim()) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Verifica se apareceu uma mensagem de erro na tela
     * Mensagens de erro geralmente aparecem quando algo dá errado
     * (ex: tentar adicionar tarefa vazia ou duplicada)
     * 
     * @returns true se houver notificação de erro visível, false caso contrário
     * 
     * @example
     * ```typescript
     * await todoAssertions.addTask(''); // Tarefa vazia
     * const temErro = await todoAssertions.hasErrorNotification();
     * if (temErro) {
     *   console.log('Apareceu uma mensagem de erro');
     * }
     * ```
     */
    async hasErrorNotification(): Promise<boolean> {
        try {
            await this.locators.errorNotification.waitFor({ state: 'visible', timeout: 2000 });
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Verifica se apareceu uma mensagem de sucesso na tela
     * Mensagens de sucesso aparecem quando uma operação é realizada com êxito
     * 
     * @returns true se houver notificação de sucesso visível, false caso contrário
     * 
     * @example
     * ```typescript
     * await todoAssertions.addTask('Nova tarefa');
     * const temSucesso = await todoAssertions.hasSuccessNotification();
     * if (temSucesso) {
     *   console.log('Operação realizada com sucesso');
     * }
     * ```
     */
    async hasSuccessNotification(): Promise<boolean> {
        try {
            await this.locators.successNotification.waitFor({ state: 'visible', timeout: 2000 });
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Obtém todas as tarefas da lista como um array de objetos
     * Cada objeto contém o texto, status de conclusão e índice da tarefa
     * 
     * @returns Array com todas as tarefas e suas informações
     * 
     * @example
     * ```typescript
     * const todasTarefas = await todoAssertions.getAllTasks();
     * console.log('Tarefas encontradas:');
     * todasTarefas.forEach(tarefa => {
     *   console.log(`${tarefa.index}: ${tarefa.text} - ${tarefa.completed ? 'Concluída' : 'Pendente'}`);
     * });
     * ```
     */
    async getAllTasks(): Promise<Task[]> {
        const count = await this.getTaskCount();
        const tasks: Task[] = [];

        for (let i = 0; i < count; i++) {
            tasks.push({
                text: await this.getTaskText(i),
                completed: await this.isTaskCompleted(i),
                index: i
            });
        }

        return tasks;
    }
}
