# CODEC 2025 - Explorando Testes End-to-End com Playwright: Um Convite à Automação de Qualidade

<div align="center">

![Todo App Preview](https://img.shields.io/badge/Status-Demo%20Ready-brightgreen)
![Playwright](https://img.shields.io/badge/Playwright-Ready-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![CSS](https://img.shields.io/badge/CSS-Tailwind-06B6D4)

</div>

## **Sobre o Projeto**

Este é um Todo Application desenvolvido especificamente para demonstrar testes End-to-End com Playwright durante o CODEC 2025.

### **Contexto Educacional**
- **Evento**: CODEC 2025
- **Minicurso**: "Explorando Testes End-to-End com Playwright: Um Convite à Automação de Qualidade"
- **Objetivo**: Ensinar automação de testes através de um projeto prático

## **Funcionalidades**

- ➕ **CRUD Completo**: Adicionar, visualizar,  editar e excluir tarefas
- 🔄 **Filtros**: Visualizar todas, pendentes ou concluídas
- 💾 **Persistência Local**: Dados salvos no localStorage
- 🎨 **Interface**: Design com Tailwind CSS
- ⚡ **Estados de Loading**: Feedback visual durante operações
- 🔔 **Sistema de Notificações**: Alerts para ações
- ❓ **Confirmações**: Diálogos modais para ações críticas
- ⌨️ **Atalhos de Teclado**: Navegação eficiente

## **Arquitetura**

O projeto segue uma arquitetura modular otimizada para testes:

```
todo/
├── index.html                    # Interface principal
└── js/
    ├── TodoApp.js               # Aplicação principal
    ├── models/
    │   └── Task.js              # Modelo de dados
    ├── repositories/
    │   └── TaskRepository.js    # Persistência
    ├── services/
    │   └── TodoService.js       # Lógica de negócio
    ├── ui/
    │   └── TodoUI.js           # Interface do usuário
    ├── utils/
    │   ├── validation.js        # Validações
    │   ├── notifications.js     # Sistema de alertas
    │   └── confirmationDialog.js # Confirmações
    └── constants/
        └── appConfig.js         # Configurações
```

## **Pronto para Playwright**

### **Test IDs Padronizados**
Todos os elementos possuem `data-testid` consistentes:
- `task-input` - Campo de entrada
- `add-button` - Botão adicionar
- `task-list` - Lista de tarefas
- `filter-all` / `filter-pending` / `filter-completed` - Filtros

### **Estados Testáveis**
- ✅ Loading states
- ✅ Error states  
- ✅ Empty states
- ✅ Confirmation dialogs
- ✅ Success notifications

### **Operações Assíncronas**
Todas as operações são `async/await` para testes confiáveis.

## **Como Executar**

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/watusalen/todo-codec.git
   cd todo-codec
   ```

2. **Abra no navegador**:
   ```bash
   # Simplesmente abra o arquivo index.html em qualquer navegador
   open index.html
   ```

3. **Ou use um servidor local**:
   ```bash
   # Com Node.js
   npx serve .
   
   # Acesse: http://localhost:8000
   ```
