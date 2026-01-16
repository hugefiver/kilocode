// kilocode_change - new file
/**
 * Utility functions to handle both sync and async getModel() returns.
 * This is needed because some providers (like VsCodeLmHandler) return a Promise,
 * while most return the model info synchronously.
 */

import type { ModelInfo } from "@roo-code/types"
import type { ApiHandler } from "../index"

/**
 * Gets model information from an API handler, handling both sync and async cases.
 * If getModel() returns a Promise, this will await it. Otherwise returns immediately.
 * 
 * @param apiHandler - The API handler to get model info from
 * @returns Promise resolving to { id: string; info: ModelInfo }
 */
export async function getModelInfo(
	apiHandler: ApiHandler,
): Promise<{ id: string; info: ModelInfo }> {
	const result = apiHandler.getModel()
	// Check if result is a Promise
	if (result instanceof Promise) {
		return await result
	}
	return result
}

/**
 * Gets model information synchronously from an API handler.
 * If the handler returns a Promise (e.g., VsCodeLmHandler), this will throw an error.
 * Use getModelInfo() instead for safe async handling, or ensure the handler is initialized
 * before calling this.
 * 
 * @param apiHandler - The API handler to get model info from
 * @returns { id: string; info: ModelInfo }
 * @throws Error if getModel() returns a Promise
 */
export function getModelInfoSync(
	apiHandler: ApiHandler,
): { id: string; info: ModelInfo } {
	const result = apiHandler.getModel()
	if (result instanceof Promise) {
		throw new Error(
			"getModelInfoSync() cannot be used with async handlers. " +
			"Use getModelInfo() instead or ensure the handler is initialized first.",
		)
	}
	return result
}

/**
 * Checks if an API handler's getModel() returns a Promise.
 * 
 * @param apiHandler - The API handler to check
 * @returns true if getModel() returns a Promise
 */
export function isAsyncModelInfo(apiHandler: ApiHandler): boolean {
	try {
		const result = apiHandler.getModel()
		return result instanceof Promise
	} catch {
		return false
	}
}
