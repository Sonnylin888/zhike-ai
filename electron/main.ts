import { app, BrowserWindow, ipcMain } from "electron";
import { createServer } from "http";
import { appendFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const isDev = !app.isPackaged;
const port = Number(process.env.ZHIKE_PORT || 4310);
let mainWindow: BrowserWindow | null = null;

function getLogsDir() {
  const baseDir = isDev
    ? process.cwd()
    : ((process as NodeJS.Process & { resourcesPath?: string }).resourcesPath || process.cwd());
  return join(baseDir, "logs");
}

function writeLog(fileName: "app.log" | "error.log", message: string) {
  const logsDir = getLogsDir();
  if (!existsSync(logsDir)) {
    mkdirSync(logsDir, { recursive: true });
  }

  appendFileSync(join(logsDir, fileName), `${new Date().toISOString()} ${message}\n`);
}

async function startNextServer() {
  if (isDev) return process.env.ELECTRON_RENDERER_URL || "http://localhost:3000";

  const next = require("next");
  const nextApp = next({
    dev: false,
    dir: app.getAppPath()
  });
  const handler = nextApp.getRequestHandler();

  await nextApp.prepare();

  await new Promise<void>((resolve, reject) => {
    const server = createServer((request, response) => {
      handler(request, response);
    });

    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => resolve());
  });

  return `http://127.0.0.1:${port}`;
}

async function createWindow() {
  writeLog("app.log", "智课 app launching");
  const url = await startNextServer();

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1180,
    minHeight: 760,
    title: "智课",
    backgroundColor: "#020617",
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadURL(url);
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

ipcMain.handle(
  "zhike:log",
  (_event, level, message, meta) => {
    const normalizedLevel = level === "error" || level === "warn" ? level : "info";
    const line = `${String(normalizedLevel).toUpperCase()} ${String(message)} ${
      meta ? JSON.stringify(meta) : ""
    }`;
    writeLog(normalizedLevel === "error" ? "error.log" : "app.log", line);
  }
);

ipcMain.handle("zhike:get-log-path", () => getLogsDir());

app.whenReady().then(() => {
  createWindow().catch((error) => {
    writeLog("error.log", `Startup failed ${error instanceof Error ? error.stack : error}`);
  });
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow().catch((error) => {
      writeLog("error.log", `Activate failed ${error instanceof Error ? error.stack : error}`);
    });
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

process.on("uncaughtException", (error) => {
  writeLog("error.log", `Uncaught exception ${error.stack || error.message}`);
});

process.on("unhandledRejection", (reason) => {
  writeLog("error.log", `Unhandled rejection ${String(reason)}`);
});
