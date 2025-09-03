import { APP_CONFIG } from '../constants/appConfig.js';

/**
 * Utilitários de validação para a aplicação Todo
 * @module ValidationUtils
 */

/**
 * Resultado de uma validação
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Se a validação passou
 * @property {string} error - Mensagem de erro (se houver)
 */

/**
 * Valida o texto de uma tarefa
 * @param {string} text - Texto da tarefa para validar
 * @returns {ValidationResult} Resultado da validação
 */
export function validateTaskText(text) {
    if (!text || typeof text !== 'string') {
        return {
            isValid: false,
            error: APP_CONFIG.MESSAGES.ERRORS.TASK_TOO_SHORT
        };
    }

    const trimmedText = text.trim();

    if (trimmedText.length < APP_CONFIG.VALIDATION.MIN_TASK_LENGTH) {
        return {
            isValid: false,
            error: APP_CONFIG.MESSAGES.ERRORS.TASK_TOO_SHORT
        };
    }

    if (trimmedText.length > APP_CONFIG.VALIDATION.MAX_TASK_LENGTH) {
        return {
            isValid: false,
            error: APP_CONFIG.MESSAGES.ERRORS.TASK_TOO_LONG
        };
    }

    return {
        isValid: true,
        error: null
    };
}

/**
 * Valida se uma tarefa é duplicada
 * @param {string} text - Texto da tarefa para validar
 * @param {Array} existingTasks - Array de tarefas existentes
 * @returns {ValidationResult} Resultado da validação
 */
export function validateTaskDuplicate(text, existingTasks) {
    if (!text || typeof text !== 'string') {
        return {
            isValid: false,
            error: APP_CONFIG.MESSAGES.ERRORS.TASK_TOO_SHORT
        };
    }

    const trimmedText = text.trim().toLowerCase();
    
    // Verifica se já existe uma tarefa com o mesmo texto (case-insensitive)
    const isDuplicate = existingTasks.some(task => 
        task.text.trim().toLowerCase() === trimmedText
    );

    if (isDuplicate) {
        return {
            isValid: false,
            error: APP_CONFIG.MESSAGES.ERRORS.TASK_DUPLICATE
        };
    }

    return {
        isValid: true,
        error: null
    };
}

/**
 * Sanitiza texto para prevenir XSS
 * @param {string} text - Texto para sanitizar
 * @returns {string} Texto sanitizado
 */
export function sanitizeText(text) {
    if (!text || typeof text !== 'string') return '';

    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim();
}

/**
 * Valida se um ID de tarefa é válido
 * @param {number} taskId - ID da tarefa
 * @returns {ValidationResult} Resultado da validação
 */
export function validateTaskId(taskId) {
    if (!taskId || typeof taskId !== 'number' || taskId <= 0) {
        return {
            isValid: false,
            error: APP_CONFIG.MESSAGES.ERRORS.TASK_NOT_FOUND
        };
    }

    return {
        isValid: true,
        error: null
    };
}

/**
 * Valida um filtro
 * @param {string} filter - Filtro para validar
 * @returns {ValidationResult} Resultado da validação
 */
export function validateFilter(filter) {
    const validFilters = Object.values(APP_CONFIG.FILTERS);

    if (!validFilters.includes(filter)) {
        return {
            isValid: false,
            error: `Filtro inválido. Use: ${validFilters.join(', ')}`
        };
    }

    return {
        isValid: true,
        error: null
    };
}
