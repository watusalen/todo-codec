import { Page, Locator } from '@playwright/test';

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
export class BasePage {
    /** Instância da página do Playwright */
    page: Page;

    /**
     * Cria uma nova instância da página base
     * @param page - Instância da página do Playwright
     */
    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navega para a página do Todo App
     * Aguarda a página carregar completamente antes de continuar
     * 
     * @example
     * ```typescript
     * await basePage.goto();
     * ```
     */
    async goto() {
        await this.page.goto('https://todo-codec.vercel.app');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
    }

    /**
     * Limpa todos os dados salvos no navegador (localStorage)
     * Útil para começar cada teste com uma "tela limpa"
     * 
     * @example
     * ```typescript
     * await basePage.clearLocalStorage();
     * ```
     */
    async clearLocalStorage() {
        await this.page.evaluate(() => {
            localStorage.clear();
        });
        await this.page.waitForTimeout(1000);
    }

    /**
     * Recarrega a página atual
     * Aguarda a página carregar completamente após o reload
     * 
     * @example
     * ```typescript
     * await basePage.reload();
     * ```
     */
    async reload() {
        await this.page.reload();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
    }

    /**
     * Espera um elemento aparecer na tela
     * @param locator - O elemento que queremos esperar aparecer
     * @param timeout - Tempo limite para esperar (padrão: 5000ms)
     * 
     * @example
     * ```typescript
     * const botao = page.locator('button');
     * await basePage.waitForElement(botao);
     * ```
     */
    async waitForElement(locator: Locator, timeout = 5000) {
        await locator.waitFor({ state: 'visible', timeout });
    }

    /**
     * Espera um elemento sumir da tela
     * @param locator - O elemento que queremos esperar sumir
     * @param timeout - Tempo limite para esperar (padrão: 5000ms)
     * 
     * @example
     * ```typescript
     * const modal = page.locator('.modal');
     * await basePage.waitForElementHidden(modal);
     * ```
     */
    async waitForElementHidden(locator: Locator, timeout = 5000) {
        await locator.waitFor({ state: 'hidden', timeout });
    }
}
