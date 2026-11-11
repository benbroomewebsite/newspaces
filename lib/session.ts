// Privacy settings can disable session storage. Remembered preferences should
// never prevent the archive or navigation from working.
export const session = {
  getItem(key: string): string | null {
    try { return window.sessionStorage.getItem(key) } catch { return null }
  },
  setItem(key: string, value: string) {
    try { window.sessionStorage.setItem(key, value) } catch { /* Optional preference. */ }
  },
  removeItem(key: string) {
    try { window.sessionStorage.removeItem(key) } catch { /* Optional preference. */ }
  },
}
