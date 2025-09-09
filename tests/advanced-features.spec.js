const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./models/TodoPage');

test.describe('Todo App - Funcionalidades Avançadas', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.clearLocalStorage();
    await todoPage.reload();
  });

  test('deve persistir tarefas após reload da página', async () => {
    const tasks = ['Tarefa 1', 'Tarefa 2', 'Tarefa 3'];

    // Adiciona múltiplas tarefas
    for (const task of tasks) {
      await todoPage.addTask(task);
    }

    // Marca uma como concluída
    await todoPage.toggleTaskComplete(1);

    // Recarrega a página
    await todoPage.reload();

    // Verifica se as tarefas persistiram
    expect(await todoPage.getTaskCount()).toBe(3);
    expect(await todoPage.isTaskCompleted(1)).toBe(true);
    expect(await todoPage.isTaskCompleted(0)).toBe(false);
    expect(await todoPage.isTaskCompleted(2)).toBe(false);
  });

  test('deve gerenciar múltiplas tarefas corretamente', async () => {
    const tasks = [
      'Estudar JavaScript',
      'Fazer exercícios',
      'Ler documentação',
      'Praticar testes'
    ];

    // Adiciona todas as tarefas
    for (const task of tasks) {
      await todoPage.addTask(task);
    }

    expect(await todoPage.getTaskCount()).toBe(4);

    // Marca algumas como concluídas
    await todoPage.toggleTaskComplete(0);
    await todoPage.toggleTaskComplete(2);

    // Verifica o estado correto
    expect(await todoPage.isTaskCompleted(0)).toBe(true);
    expect(await todoPage.isTaskCompleted(1)).toBe(false);
    expect(await todoPage.isTaskCompleted(2)).toBe(true);
    expect(await todoPage.isTaskCompleted(3)).toBe(false);
  });

  test('deve funcionar com caracteres especiais', async () => {
    const specialTasks = [
      'Tarefa com acentos: ção, ã, é',
      'Emojis: 🚀 📝 ✅',
      'Números: 123 456.789',
      'Símbolos: @#$%&*()[]{}',
    ];

    for (const task of specialTasks) {
      await todoPage.addTask(task);
    }

    expect(await todoPage.getTaskCount()).toBe(4);

    // Verifica se o texto foi preservado corretamente
    for (let i = 0; i < specialTasks.length; i++) {
      expect(await todoPage.getTaskText(i)).toBe(specialTasks[i]);
    }
  });
});
