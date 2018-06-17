export interface Config {
    watcher: {
        glob: string;
        opt: any;
    };
}
declare class ReloadManager {
    private watcher;
    constructor();
    /**
     * Initialize and start the files watcher
     * @param {Config} config - Configuration for the reload
     */
    startWatcher(config: Config): void;
    closeWatcher(): void;
    addReloadMenuItem(shortkeyPattern: string): void;
    /**
     * Emit 'before-reload' in all windows that registered to that event.
     * All the rest of windows reload themselves.
     */
    askForReload(): void;
    /**
     * Register each new window to reload events
     * @param {Electron.App} app - Electron App
     */
    private handleNewCreatedWindows;
    private addMenuItemAndGlobalShortKey;
}
export default ReloadManager;
