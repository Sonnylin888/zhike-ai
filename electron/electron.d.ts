declare module "electron" {
  export const app: {
    isPackaged: boolean;
    getAppPath: () => string;
    whenReady: () => Promise<void>;
    on: (event: string, callback: (...args: unknown[]) => void) => void;
    quit: () => void;
  };

  export class BrowserWindow {
    constructor(options: Record<string, unknown>);
    loadURL(url: string): void;
    on(event: string, callback: (...args: unknown[]) => void): void;
    static getAllWindows(): BrowserWindow[];
  }

  export const ipcMain: {
    handle: (
      channel: string,
      listener: (event: unknown, ...args: unknown[]) => unknown
    ) => void;
  };

  export const contextBridge: {
    exposeInMainWorld(key: string, api: Record<string, unknown>): void;
  };

  export const ipcRenderer: {
    invoke(channel: string, ...args: unknown[]): Promise<unknown>;
  };
}
