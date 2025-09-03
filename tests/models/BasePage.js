/**
 * Classe base para elementos comuns do Page Object Model
 */
class BasePage {
    constructor(page) {
        this.page = page;
    }

    /**
     * Navega para a página do Todo App
     */
    async goto() {
        await this.page.goto('http://localhost:8080');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
    }

    /**
     * Limpa o localStorage
     */
    async clearLocalStorage() {
        await this.page.evaluate(() => {
            localStorage.clear();
        });
        await this.page.waitForTimeout(1000);
    }

    /**
     * Recarrega a página
     */
    async reload() {
        await this.page.reload();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
    }

    /**
     * Espera por um elemento estar visível
     */
    async waitForElement(locator, timeout = 5000) {
        await locator.waitFor({ state: 'visible', timeout });
    }

    /**
     * Espera por um elemento estar oculto
     */
    async waitForElementHidden(locator, timeout = 5000) {
        await locator.waitFor({ state: 'hidden', timeout });
    }
}

module.exports = { BasePage };
