const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./models/TodoPage');

test.describe('Todo App - Validações', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.clearLocalStorage();
    await todoPage.reload();
  });

  test('deve impedir adicionar tarefa vazia', async () => {
    // Tenta adicionar tarefa vazia
    await todoPage.addTask('');
    
    // Verifica que nenhuma tarefa foi adicionada
    expect(await todoPage.getTaskCount()).toBe(0);
    expect(await todoPage.isEmptyStateVisible()).toBe(true);
  });

  test('deve impedir tarefas duplicadas', async () => {
    const taskText = 'Tarefa duplicada';
    
    // Adiciona a primeira tarefa
    await todoPage.addTask(taskText);
    expect(await todoPage.getTaskCount()).toBe(1);
    
    // Tenta adicionar a mesma tarefa novamente (deve falhar)
    await todoPage.addTask(taskText);
    
    // Verifica se ainda há apenas uma tarefa (duplicata foi rejeitada)
    expect(await todoPage.getTaskCount()).toBe(1);
    
    // Verifica se uma notificação de erro apareceu
    await expect(todoPage.errorNotification).toBeVisible();
  });

  test('deve permitir tarefas com textos similares mas não idênticos', async () => {
    // Adiciona tarefas similares mas diferentes
    await todoPage.addTask('Comprar pão');
    await todoPage.addTask('Comprar pães');
    await todoPage.addTask('COMPRAR PÃO'); // Deve ser rejeitada (case-insensitive)
    
    // Verifica que apenas duas tarefas foram adicionadas
    expect(await todoPage.getTaskCount()).toBe(2);
  });
});
