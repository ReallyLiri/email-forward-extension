import { Configuration } from "../../common/configuration";

export enum ExtensionEventType {
  InjectionLoaded = 'InjectionLoaded',
  ReadConfiguration = 'ReadConfiguration',
  ConfigurationContent = 'ConfigurationContent',
  ManualPatch = 'ManualPatch'
}

export type ExtensionEvent = {
  type: ExtensionEventType,
  configuration?: Configuration | undefined
}

export interface ExtensionEventListener {
  (event: ExtensionEvent): void;
}
