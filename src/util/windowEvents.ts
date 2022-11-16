import { ExtensionEvent, ExtensionEventListener, ExtensionEventType } from "./event";
import { log } from "../../common/log";

export const addEventListener = (type: ExtensionEventType, listener: ExtensionEventListener) => {
  window.addEventListener(type, event => {
    log("Event received", event);
    listener((<CustomEvent>event).detail);
  }, false);
}

export const dispatchEvent = (event: ExtensionEvent) => {
  log("Event dispatch", event);
  window.dispatchEvent(new CustomEvent(event.type, {detail: event}));
}
