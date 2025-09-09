const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./models/TodoPage');

test.describe('Todo App - Gerenciamento de Tarefas', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.clearLocalStorage();
    await todoPage.reload();
  });

  test('deve excluir uma tarefa com confirmação', async () => {
    const taskText = 'Tarefa para excluir';

    // Adiciona uma tarefa
    await todoPage.addTask(taskText);
    expect(await todoPage.getTaskCount()).toBe(1);

    // Exclui a tarefa
    await todoPage.deleteTask(0, true);

    // Verifica se a tarefa foi removida
    expect(await todoPage.getTaskCount()).toBe(0);
    expect(await todoPage.isEmptyStateVisible()).toBe(true);
  });

  test('deve cancelar exclusão de tarefa', async () => {
    const taskText = 'Tarefa para não excluir';

    // Adiciona uma tarefa
    await todoPage.addTask(taskText);
    expect(await todoPage.getTaskCount()).toBe(1);

    // Cancela a exclusão
    await todoPage.deleteTask(0, false);

    // Verifica se a tarefa ainda existe
    expect(await todoPage.getTaskCount()).toBe(1);
    expect(await todoPage.getTaskText(0)).toBe(taskText);
  });
});
