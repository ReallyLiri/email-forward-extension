import { ExtensionEvent, ExtensionEventType } from "./util/event";
import { addEventListener, dispatchEvent } from "./util/windowEvents";
import { error, log } from "../common/log";
import { Configuration } from "../common/configuration";

const injectScript = (src: string) => {
  log("loading script", src)
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = chrome.runtime.getURL(src);
  (document.body || document.head || document.documentElement).appendChild(script);
}

injectScript("injected.js")

addEventListener(ExtensionEventType.InjectionLoaded, async () => {
  const configuration = await chrome.runtime.sendMessage({type: ExtensionEventType.ReadConfiguration}) as Configuration | undefined;
  dispatchEvent({type: ExtensionEventType.ConfigurationContent, configuration});
});

chrome.runtime.onMessage.addListener((event: ExtensionEvent, sender, sendResponse) => {
  log("onMessage", event, sender)
  switch (event.type) {
    case ExtensionEventType.ConfigurationContent:
    case ExtensionEventType.ManualPatch:
      dispatchEvent(event);
      sendResponse();
      break;
    default:
      error("unexpected event type", event);
      sendResponse();
  }
  return true;
});
