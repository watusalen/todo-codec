import { test, expect, Page } from '@playwright/test';
import { TodoPage } from './models/TodoPage';
import { Task } from './models/TodoAssertions';

test.describe('Todo App - Funcionalidades Avançadas (TypeScript)', () => {
    let todoPage: TodoPage;

    test.beforeEach(async ({ page }: { page: Page }) => {
        todoPage = new TodoPage(page);
        await todoPage.goto();
        await todoPage.clearLocalStorage();
        await todoPage.reload();
    });

    test('deve manter dados após recarregar', async () => {
        const tasks = ['Tarefa 1', 'Tarefa 2', 'Tarefa 3'];

        // Adiciona várias tarefas
        for (const task of tasks) {
            await todoPage.addTask(task);
        }

        // Marca uma como concluída
        await todoPage.toggleTaskComplete(1);

        // Recarrega a página
        await todoPage.reload();

        // Verifica se os dados foram mantidos
        expect(await todoPage.getTaskCount()).toBe(3);
        expect(await todoPage.isTaskCompleted(1)).toBe(true);
        expect(await todoPage.isTaskCompleted(0)).toBe(false);
        expect(await todoPage.isTaskCompleted(2)).toBe(false);
    });

    test('deve gerenciar múltiplas tarefas', async () => {
        const tasks = ['Primeira', 'Segunda', 'Terceira', 'Quarta'];

        // Adiciona múltiplas tarefas
        for (const task of tasks) {
            await todoPage.addTask(task);
        }

        expect(await todoPage.getTaskCount()).toBe(4);

        // Marca algumas como concluídas
        await todoPage.toggleTaskComplete(0);
        await todoPage.toggleTaskComplete(2);

        // Verifica os estados
        expect(await todoPage.isTaskCompleted(0)).toBe(true);
        expect(await todoPage.isTaskCompleted(1)).toBe(false);
        expect(await todoPage.isTaskCompleted(2)).toBe(true);
        expect(await todoPage.isTaskCompleted(3)).toBe(false);
    });

    test('deve trabalhar com caracteres especiais', async () => {
        const specialTasks = [
            'Café com açúcar',
            'Símbolos: @#$%',
            'Números: 123',
            'Emojis: 🚀 ✨'
        ];

        // Adiciona tarefas com caracteres especiais
        for (const task of specialTasks) {
            await todoPage.addTask(task);
        }

        expect(await todoPage.getTaskCount()).toBe(4);

        // Verifica se os textos foram preservados
        for (let i = 0; i < specialTasks.length; i++) {
            expect(await todoPage.getTaskText(i)).toBe(specialTasks[i]);
        }
    });

    test('deve retornar todas as tarefas com getAllTasks', async () => {
        const taskTexts = ['Tarefa A', 'Tarefa B', 'Tarefa C'];

        // Adiciona tarefas
        for (const taskText of taskTexts) {
            await todoPage.addTask(taskText);
        }

        // Marca algumas como concluídas
        await todoPage.toggleTaskComplete(0);
        await todoPage.toggleTaskComplete(2);

        // Pega todas as tarefas
        const allTasks: Task[] = await todoPage.getAllTasks();

        // Verifica a estrutura
        expect(allTasks).toHaveLength(3);
        expect(allTasks[0]).toEqual({
            text: 'Tarefa A',
            completed: true,
            index: 0
        });
        expect(allTasks[1]).toEqual({
            text: 'Tarefa B',
            completed: false,
            index: 1
        });
        expect(allTasks[2]).toEqual({
            text: 'Tarefa C',
            completed: true,
            index: 2
        });
    });
});
