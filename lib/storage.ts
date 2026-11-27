import { isClient, localGet, localRemove, localSave } from "./utils";

/**
 * All keys this app writes to localStorage. Prefixed so they don't collide with
 * other apps on the same origin (e.g. localhost during development).
 */
export const STORAGE_KEYS = {
    boards: "kanban:boards",
    selectedBoardId: "kanban:selectedBoardId",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/**
 * Reads and JSON-parses a value from localStorage.
 *
 * Returns `fallback` when running on the server, when the key is missing, when the stored
 * value isn't valid JSON, or when `isValid` rejects it. Never throws.
 *
 * @param key - The key to read
 * @param fallback - Returned whenever a usable value can't be read
 * @param isValid - Optional shape check for the parsed value
 */
export function getItem<T>(key: StorageKey, fallback: T, isValid?: (value: unknown) => value is T): T {
    if (!isClient()) return fallback;

    try {
        const raw = localGet(key);
        if (raw === null) return fallback;

        const parsed: unknown = JSON.parse(raw);
        if (isValid && !isValid(parsed)) return fallback;

        return parsed as T;
    } catch (error) {
        // Corrupt JSON, or storage blocked (private mode, disabled site data)
        console.warn(`[storage] Could not read "${key}"`, error);
        return fallback;
    }
}

/**
 * JSON-serialises `value` and writes it to localStorage, replacing whatever was there.
 *
 * @param key - The key to write
 * @param value - Any JSON-serialisable value
 * @returns true if the write succeeded, false otherwise (server, quota exceeded, storage blocked)
 */
export function setItem<T>(key: StorageKey, value: T): boolean {
    if (!isClient()) return false;

    try {
        localSave(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.warn(`[storage] Could not write "${key}"`, error);
        return false;
    }
}

/**
 * Reads the current value, passes it to `updater`, and writes the result back.
 *
 * @param key - The key to update
 * @param fallback - Used as the current value when nothing usable is stored
 * @param updater - Receives the current value and returns the next one
 * @param isValid - Optional shape check for the stored value
 * @returns The updated value (returned even if the write itself failed)
 */
export function updateItem<T>(
    key: StorageKey,
    fallback: T,
    updater: (current: T) => T,
    isValid?: (value: unknown) => value is T
): T {
    const next = updater(getItem(key, fallback, isValid));
    setItem(key, next);
    return next;
}

/**
 * Removes a key from localStorage. Never throws.
 *
 * @param key - The key to remove
 */
export function removeItem(key: StorageKey): void {
    if (!isClient()) return;

    try {
        localRemove(key);
    } catch (error) {
        console.warn(`[storage] Could not remove "${key}"`, error);
    }
}

/* ------------------------------------------------------------------ */
/* Boards                                                              */
/* ------------------------------------------------------------------ */

/** Light structural check so a corrupt or outdated payload doesn't crash the app. */
const isBoardList = (value: unknown): value is Board[] =>
    Array.isArray(value) &&
    value.every(
        (board) =>
            typeof board === "object" &&
            board !== null &&
            typeof board.id === "string" &&
            typeof board.name === "string" &&
            Array.isArray(board.columns) &&
            board.columns.every(
                (column: unknown) =>
                    typeof column === "object" &&
                    column !== null &&
                    typeof (column as Column).id === "string" &&
                    typeof (column as Column).name === "string" &&
                    Array.isArray((column as Column).tasks)
            )
    );

/**
 * Fetches the stored boards.
 *
 * @returns The stored boards, or null if none are stored yet (or the stored data is invalid),
 * so callers can tell "never saved" apart from "saved an empty list".
 */
export function getBoards(): Board[] | null {
    return getItem<Board[] | null>(STORAGE_KEYS.boards, null, (value): value is Board[] | null => isBoardList(value));
}

/**
 * Saves the full list of boards, replacing what's stored.
 *
 * @returns true if the write succeeded
 */
export function saveBoards(boards: Board[]): boolean {
    return setItem(STORAGE_KEYS.boards, boards);
}

/**
 * Updates the stored boards with `updater` and saves the result.
 *
 * @param updater - Receives the stored boards (or [] if none) and returns the new list
 * @returns The updated boards
 */
export function updateBoards(updater: (boards: Board[]) => Board[]): Board[] {
    return updateItem(STORAGE_KEYS.boards, [], updater, isBoardList);
}

/** Fetches the id of the last selected board, or null if none is stored. */
export function getSelectedBoardId(): string | null {
    return getItem<string | null>(STORAGE_KEYS.selectedBoardId, null, (value): value is string | null => typeof value === "string");
}

/** Saves the id of the selected board, or clears it when `boardId` is undefined. */
export function saveSelectedBoardId(boardId: string | undefined): boolean {
    if (boardId === undefined) {
        removeItem(STORAGE_KEYS.selectedBoardId);
        return true;
    }
    return setItem(STORAGE_KEYS.selectedBoardId, boardId);
}
