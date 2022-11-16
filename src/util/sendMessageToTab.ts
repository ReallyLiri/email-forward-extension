import { ExtensionEvent } from "./event";
import { error, log } from "../../common/log";

export const sendMessageToTab = (tab: chrome.tabs.Tab, message: ExtensionEvent) =>
  chrome.tabs.sendMessage(
    tab.id!,
    message,
    () => {
      const {lastError} = chrome.runtime;
      if (lastError) {
        const {message} = lastError;
        if (message === "Could not establish connection. Receiving end does not exist.") {
          log("tab is not listening for messages", tab);
        } else {
          error("failed to send message to tab", tab, lastError);
        }
      }
    }
  );
