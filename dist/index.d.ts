export interface Config {
    watcher: {
        glob: string;
        opt: any;
    };
}
/**
 * Initialize hot reload
 * @param {Config} config - Configuration for the reload
 */
export declare function initHotReloader(config: Config): void;
export default initHotReloader;
