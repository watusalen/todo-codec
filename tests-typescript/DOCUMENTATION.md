# 📚 Documentação JSDoc - Todo App TypeScript

## 🎯 **O que é JSDoc?**

JSDoc é uma forma de documentar código JavaScript/TypeScript usando comentários especiais. Os editores de código (como VS Code) usam essa documentação para:

- **Mostrar ajuda** quando você passa o mouse sobre uma função
- **Sugerir parâmetros** enquanto você digita
- **Explicar o que cada função faz**
- **Dar exemplos** de como usar

## 💡 **Como Ver a Documentação**

### No VS Code:
1. **Passe o mouse** sobre qualquer método ou classe
2. **Ctrl+Espaço** para ver sugestões com documentação
3. **Ctrl+Click** em uma função para ir até sua definição

### Exemplo prático:
```typescript
// Quando você digitar todoPage.addTask(
// O VS Code vai mostrar:
// addTask(taskText: string): Promise<void>
// Adiciona uma nova tarefa à lista
// @param taskText - O texto da tarefa a ser adicionada
```

## 📖 **Estrutura da Documentação**

### **Classe BasePage**
```typescript
/**
 * Classe base simples para Page Objects
 * Contém funcionalidades básicas que todas as páginas precisam
 * 
 * @example
 * ```typescript
 * class MinhaPage extends BasePage {
 *   constructor(page: Page) {
 *     super(page);
 *   }
 * }
 * ```
 */
```

### **Métodos com Parâmetros**
```typescript
/**
 * Adiciona uma nova tarefa à lista
 * 
 * @param taskText - O texto da tarefa a ser adicionada
 * @returns Promise que resolve quando a tarefa for adicionada
 * 
 * @example
 * ```typescript
 * await todoActions.addTask('Comprar leite');
 * ```
 */
async addTask(taskText: string): Promise<void>
```

### **Tipos e Interfaces**
```typescript
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
```

## 🔧 **Tags JSDoc Usadas**

| Tag | Descrição | Exemplo |
|-----|-----------|---------|
| `@param` | Descreve um parâmetro | `@param taskText - Texto da tarefa` |
| `@returns` | Descreve o retorno | `@returns Número de tarefas` |
| `@example` | Mostra exemplo de uso | `@example await addTask('teste')` |
| `@throws` | Descreve erros possíveis | `@throws Error se filtro inválido` |

## 🚀 **Benefícios para Alunos**

### **1. Aprendizado Autônomo**
```typescript
// Em vez de adivinhar o que faz:
await todoPage.isTaskCompleted(0); // ❓ O que isso retorna?

// Com JSDoc você vê imediatamente:
// isTaskCompleted(taskIndex: number): Promise<boolean>
// Verifica se uma tarefa está marcada como concluída
// @param taskIndex - Índice da tarefa na lista (começa em 0)
// @returns true se a tarefa estiver concluída, false caso contrário
```

### **2. Menos Erros**
```typescript
// Sem documentação:
await todoPage.deleteTask(0, "sim"); // ❌ Erro: esperava boolean

// Com JSDoc você vê:
// deleteTask(taskIndex: number, confirmDelete: boolean = true)
// @param confirmDelete - Se true confirma a exclusão, se false cancela
```

### **3. Exemplos Práticos**
Cada método tem exemplos reais de como usar:

```typescript
/**
 * @example
 * ```typescript
 * const total = await todoAssertions.getTaskCount();
 * console.log(`Existem ${total} tarefas na lista`);
 * ```
 */
```

## 📝 **Como Escrever JSDoc**

### **Formato Básico:**
```typescript
/**
 * Descrição breve do que a função faz
 * 
 * Descrição mais detalhada se necessário
 * 
 * @param nomeParametro - Descrição do parâmetro
 * @returns Descrição do que retorna
 * 
 * @example
 * ```typescript
 * // Exemplo de uso aqui
 * ```
 */
```

### **Dicas de Boa Prática:**
1. **Seja claro e conciso**
2. **Use exemplos práticos**
3. **Explique parâmetros e retornos**
4. **Documente comportamentos especiais**
5. **Use linguagem simples**

## 🎓 **Para Professores**

Esta documentação ajuda os alunos a:
- **Entender o código** sem precisar ler a implementação
- **Usar as funções corretamente** na primeira tentativa
- **Aprender boas práticas** de documentação
- **Desenvolver autonomia** para explorar o código

## 🔗 **Próximos Passos**

1. **Explore o código** usando a documentação
2. **Experimente** passar o mouse sobre as funções
3. **Leia os exemplos** e teste no seu código
4. **Pratique** escrevendo sua própria documentação
