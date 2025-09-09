const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./models/TodoPage');

test.describe('Todo App - Funcionalidades Básicas', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.clearLocalStorage();
    await todoPage.reload();
  });

  test('deve carregar a página corretamente', async () => {
    // Verifica se os elementos principais estão visíveis
    await expect(todoPage.locators.taskInput).toBeVisible();
    await expect(todoPage.locators.addButton).toBeVisible();
    await expect(todoPage.locators.taskList).toBeVisible();

    // Verifica se o estado vazio está sendo exibido
    expect(await todoPage.isEmptyStateVisible()).toBe(true);
    expect(await todoPage.getTaskCount()).toBe(0);
  });

  test('deve adicionar uma nova tarefa', async () => {
    const taskText = 'Minha primeira tarefa';

    await todoPage.addTask(taskText);

    // Verifica se a tarefa foi adicionada
    expect(await todoPage.getTaskCount()).toBe(1);
    expect(await todoPage.getTaskText(0)).toBe(taskText);
    expect(await todoPage.isEmptyStateVisible()).toBe(false);
  });

  test('deve marcar tarefa como concluída', async () => {
    const taskText = 'Tarefa para concluir';

    // Adiciona uma tarefa
    await todoPage.addTask(taskText);
    expect(await todoPage.isTaskCompleted(0)).toBe(false);

    // Marca como concluída
    await todoPage.toggleTaskComplete(0);
    expect(await todoPage.isTaskCompleted(0)).toBe(true);

    // Desmarca como concluída
    await todoPage.toggleTaskComplete(0);
    expect(await todoPage.isTaskCompleted(0)).toBe(false);
  });
});
