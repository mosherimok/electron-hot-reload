import * as Electron from 'electron';
import BrowserWindow = Electron.BrowserWindow;

const electron = require('electron');
const chokidar = require('chokidar');

export interface Config {
  watcher: {glob: string, opt: any};
}

/**
 * Register each new window to reload events
 * @param {Electron.App} app - Electron App
 */
function handleNewCreatedWindows(app: Electron.App) {
  app.on('browser-window-created', (e: Event, window: BrowserWindow) => {
    window.on('ready-for-reload' as any, (ev: Event) => {
      window.webContents.reloadIgnoringCache();
    });
  });
}

/**
 * On files that the config.glob includes change
 */
function onFilesChange() {
  electron.BrowserWindow.getAllWindows().forEach((window: BrowserWindow) => {
    if (window.listenerCount('before-reload') > 0){
      window.emit('before-reload');
    } else {
      window.webContents.reloadIgnoringCache();
    }
  });
}

/**
 * Initialize hot reload
 * @param {Config} config - Configuration for the reload
 */
export function initHotReloader(config: Config) {
  handleNewCreatedWindows(electron.app);
  const watcher = chokidar.watch(config.watcher.glob, config.watcher.opt);
  watcher.on('change', () => onFilesChange());
}

export default initHotReloader;
