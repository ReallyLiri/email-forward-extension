import { getBucket } from "@extend-chrome/storage";
import { Configuration } from "../../common/configuration";

const store = getBucket<Configuration>('config-v1', 'sync');

export const getConfigurationAsync = async (): Promise<Configuration> =>
  await store.get();
