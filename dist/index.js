"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require('electron');
const chokidar = require('chokidar');
/**
 * Register each new window to reload events
 * @param {Electron.App} app - Electron App
 */
function handleNewCreatedWindows(app) {
    app.on('browser-window-created', (e, window) => {
        window.on('ready-for-reload', (ev) => {
            window.webContents.reloadIgnoringCache();
        });
    });
}
/**
 * On files that the config.glob includes change
 */
function onFilesChange() {
    electron.BrowserWindow.getAllWindows().forEach((window) => {
        if (window.listenerCount('before-reload') > 0) {
            window.emit('before-reload');
        }
        else {
            window.webContents.reloadIgnoringCache();
        }
    });
}
/**
 * Initialize hot reload
 * @param {Config} config - Configuration for the reload
 */
function initHotReloader(config) {
    handleNewCreatedWindows(electron.app);
    const watcher = chokidar.watch(config.watcher.glob, config.watcher.opt);
    watcher.on('change', () => onFilesChange());
}
exports.initHotReloader = initHotReloader;
exports.default = initHotReloader;
//# sourceMappingURL=index.js.map