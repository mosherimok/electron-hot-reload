import * as Electron from 'electron';
import BrowserWindow = Electron.BrowserWindow;
import {FSWatcher} from 'fs';
import Menu = Electron.Menu;
import MenuItem = Electron.MenuItem;
import MenuItemConstructorOptions = Electron.MenuItemConstructorOptions;
import Accelerator = Electron.Accelerator;

const electron = require('electron');
const chokidar = require('chokidar');

export interface Config {
  watcher: { glob: string, opt: any };
}

class ReloadManager {
  private watcher: FSWatcher;

  constructor(){
    this.handleNewCreatedWindows(electron.app);
  }

  /**
   * Initialize and start the files watcher
   * @param {Config} config - Configuration for the reload
   */
  public startWatcher(config: Config) {
    this.watcher = chokidar.watch(config.watcher.glob, config.watcher.opt);
    this.watcher.on('change', () => this.askForReload());
  }

  public closeWatcher() {
    if (!this.watcher)
      return;

    this.watcher.close();
  }

  public addReloadMenuItem(shortkeyPattern: string) {
    if (electron.app.isReady()) {
      this.addMenuItemAndGlobalShortKey(shortkeyPattern);
    } else {
      electron.app.on('ready', () => {
        this.addMenuItemAndGlobalShortKey(shortkeyPattern);
      });
    }
  }

  /**
   * Emit 'before-reload' in all windows that registered to that event.
   * All the rest of windows reload themselves.
   */
  public askForReload(){
    electron.BrowserWindow.getAllWindows().forEach((window: BrowserWindow) => {
      if (window.listenerCount('before-reload') > 0) {
        window.emit('before-reload');
      } else {
        window.webContents.reloadIgnoringCache();
      }
    });
  }

  /**
   * Register each new window to reload events
   * @param {Electron.App} app - Electron App
   */
  private handleNewCreatedWindows(app: Electron.App) {
    app.on('browser-window-created', (e: Event, window: BrowserWindow) => {
      window.once('ready-for-reload' as any, (ev: Event) => {
        window.webContents.reloadIgnoringCache();
      });
    });
  }

  private addMenuItemAndGlobalShortKey(shortkeyPattern: string){
    let menuItem = new electron.MenuItem({
      label: 'Planned Reload',
      click: menuItem => this.askForReload(),
      accelerator: shortkeyPattern
    });
    let viewMenu = electron.Menu.getApplicationMenu().items.find(m => m.label.toLowerCase() == 'view') as MenuItemConstructorOptions;
    if (viewMenu != null) {
      (viewMenu.submenu as Menu).insert(0,menuItem);
      electron.globalShortcut.register(shortkeyPattern, () => this.askForReload());
    }
  }
}

export default ReloadManager;
