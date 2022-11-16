import { log } from "../../../common/log";
import { Configuration } from "../../../common/configuration";

const STORAGE_KEY = 'config-v1';

interface Storage {
  get(): Promise<Configuration>;

  set(configuration: Configuration): Promise<Configuration>;
}

const resolved = <T, >(value: T): Promise<T> => new Promise(resolve => resolve(value));

let store: Storage;

const loadStore = import("@extend-chrome/storage")
  .then(({getBucket}) => {
    store = getBucket<Configuration>(STORAGE_KEY, 'sync');
  })
  .catch(err => {
    if (process.env.NODE_ENV !== "development") {
      throw err;
    }
    console.log("cannot load chrome storage, assuming debug run", err);
    store = {
      get(): Promise<Configuration> {
        return resolved(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as Configuration);
      },
      set(configuration): Promise<Configuration> {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(configuration));
        return resolved(configuration);
      }
    }
  });

export const getConfigurationAsync = async (): Promise<Configuration> => {
  await loadStore;
  const configuration = await store.get();
  log("getConfigurationAsync", configuration);
  return configuration;
}

export const setConfigurationAsync = async (configuration: Configuration): Promise<void> => {
  await loadStore;
  log("setConfigurationAsync", configuration);
  await store.set(configuration);
}
