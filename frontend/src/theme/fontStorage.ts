import { CustomFont } from '../types/theme';

const DB_NAME = 'userflow_theme_db';
const STORE_NAME = 'theme_assets';
const FONT_KEY = 'active_custom_font';

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Saves font to IndexedDB (with localStorage fallback)
 */
export async function saveFontToStorage(font: CustomFont): Promise<void> {
  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(font, FONT_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB save failed, falling back to localStorage if size permits', err);
    try {
      localStorage.setItem('userflow_custom_font', JSON.stringify(font));
    } catch {
      // ignore
    }
  }
}

/**
 * Retrieves saved font from IndexedDB or localStorage fallback
 */
export async function getFontFromStorage(): Promise<CustomFont | null> {
  try {
    const db = await getDB();
    return await new Promise<CustomFont | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(FONT_KEY);
      req.onsuccess = () => resolve((req.result as CustomFont) || null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      const raw = localStorage.getItem('userflow_custom_font');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}

/**
 * Deletes saved custom font from IndexedDB and localStorage
 */
export async function deleteFontFromStorage(): Promise<void> {
  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(FONT_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // ignore
  }
  try {
    localStorage.removeItem('userflow_custom_font');
  } catch {
    // ignore
  }
}
