"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require('electron');
const chokidar = require('chokidar');
class ReloadManager {
    constructor() {
        this.handleNewCreatedWindows(electron.app);
    }
    /**
     * Initialize and start the files watcher
     * @param {Config} config - Configuration for the reload
     */
    startWatcher(config) {
        this.watcher = chokidar.watch(config.watcher.glob, config.watcher.opt);
        this.watcher.on('change', () => this.askForReload());
    }
    closeWatcher() {
        if (!this.watcher)
            return;
        this.watcher.close();
    }
    addReloadMenuItem(shortkeyPattern) {
        if (electron.app.isReady()) {
            this.addMenuItemAndGlobalShortKey(shortkeyPattern);
        }
        else {
            electron.app.on('ready', () => {
                this.addMenuItemAndGlobalShortKey(shortkeyPattern);
            });
        }
    }
    /**
     * Emit 'before-reload' in all windows that registered to that event.
     * All the rest of windows reload themselves.
     */
    askForReload() {
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
     * Register each new window to reload events
     * @param {Electron.App} app - Electron App
     */
    handleNewCreatedWindows(app) {
        app.on('browser-window-created', (e, window) => {
            window.once('ready-for-reload', (ev) => {
                window.webContents.reloadIgnoringCache();
            });
        });
    }
    addMenuItemAndGlobalShortKey(shortkeyPattern) {
        let menuItem = new electron.MenuItem({
            label: 'Planned Reload',
            click: menuItem => this.askForReload(),
            accelerator: shortkeyPattern
        });
        let viewMenu = electron.Menu.getApplicationMenu().items.find(m => m.label.toLowerCase() == 'view');
        if (viewMenu != null) {
            viewMenu.submenu.insert(0, menuItem);
            electron.globalShortcut.register(shortkeyPattern, () => this.askForReload());
        }
    }
}
exports.default = ReloadManager;
//# sourceMappingURL=index.js.map