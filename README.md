# Todo App - CODEC 2025

Aplicação Todo desenvolvida para demonstrar testes End-to-End com Playwright no minicurso CODEC 2025.

🌐 **Demo:** https://todo-codec.vercel.app

## Características

- Aplicação Todo completa com CRUD de tarefas
- Validação de duplicatas e entrada de dados
- Persistência no localStorage
- Interface responsiva com Tailwind CSS
- Testes E2E organizados com Page Object Model
- Arquitetura modular em JavaScript ES6
- Deploy automatizado no Vercel

## Estrutura do Projeto

```
├── index.html              # Página principal
├── js/                     # Código fonte
│   ├── TodoApp.js          # Aplicação principal
│   ├── constants/          # Configurações
│   ├── models/             # Modelos de dados
│   ├── repositories/       # Persistência
│   ├── services/           # Regras de negócio
│   ├── ui/                 # Interface
│   └── utils/              # Utilitários
├── src/                    # Estilos
│   ├── input.css           # Tailwind source
│   └── output.css          # CSS compilado
└── tests/                  # Testes E2E
    ├── models/             # Page Object Model modular
    ├── basic-functionality.spec.js
    ├── task-management.spec.js
    ├── validation.spec.js
    └── advanced-features.spec.js
```

## Instalação e Execução

### 1. Instalar dependências
```bash
npm install
npx playwright install
```

### 2. Executar aplicação

**Opção A: Demo online**
```
https://todo-codec.vercel.app
```

**Opção B: Servidor local**
```bash
# Python
python -m http.server 8080

# Node.js
npx http-server -p 8080
```

Acesse: http://localhost:8080

## Executando os Testes

Os testes estão configurados para usar a URL do Vercel (https://todo-codec.vercel.app).

```bash
# Todos os testes
npm test

# Com interface visual
npm run test:headed

# Interface do Playwright
npm run test:ui

# Testes específicos
npm run test:basic       # Funcionalidades básicas
npm run test:management  # Gerenciamento de tarefas
npm run test:validation  # Validações
npm run test:advanced    # Funcionalidades avançadas
```

> **Nota:** Para usar localhost, edite `tests/models/BasePage.js` e altere a URL.

## Page Object Model

O projeto utiliza uma arquitetura modular para os testes:

- **BasePage.js** - Funcionalidades base de navegação
- **TodoLocators.js** - Localizadores centralizados
- **TodoActions.js** - Ações específicas da aplicação
- **TodoAssertions.js** - Verificações e assertions
- **TodoPage.js** - POM principal que herda dos módulos

## Funcionalidades Testadas

### Básicas
- Carregamento da página
- Adicionar tarefa
- Marcar como concluída

### Gerenciamento
- Excluir com confirmação
- Cancelar exclusão

### Validações
- Impedir tarefa vazia
- Impedir duplicatas (case-insensitive)

### Avançadas
- Persistência após reload
- Múltiplas tarefas
- Caracteres especiais

## Deploy

O projeto está configurado para deploy automático no Vercel:

1. **Vercel CLI:**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Vercel Dashboard:**
   - Conecte o repositório GitHub
   - Deploy automático a cada push

**URL de produção:** https://todo-codec.vercel.app

## Desenvolvimento

```bash
# Compilar CSS (modo watch)
npm run build-css

# Compilar CSS (produção)
npm run build-css-prod
```

## Autor

Matusalen Alves - CODEC 2025
