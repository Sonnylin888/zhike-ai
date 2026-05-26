import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("zhiKeDesktop", {
  log: (level: "info" | "warn" | "error", message: string, meta?: Record<string, unknown>) =>
    ipcRenderer.invoke("zhike:log", level, message, meta),
  getLogPath: () => ipcRenderer.invoke("zhike:get-log-path")
});
