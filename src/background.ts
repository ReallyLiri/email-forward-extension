import { getConfigurationAsync } from "./util/storage";
import { ExtensionEvent, ExtensionEventType } from "./util/event";
import { messageTab } from "./util/messageTab";
import { error, log } from "../common/log";

const GMAIL_URL_SKELETON = "://mail.google.com/";

chrome.runtime.onInstalled.addListener(async (details) => {
  log("onInstalled", details);
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create(
      {url: `chrome-extension://${ chrome.runtime.id }/index.html`},
      (tab) => log("options page opened")
    );
  }
});

chrome.action.onClicked.addListener(tab => {
  log("action.onClicked", tab);
  if (!tab || !tab.id || !tab.url || tab.url.indexOf(GMAIL_URL_SKELETON) < 0) {
    return;
  }
  messageTab(tab, {type: ExtensionEventType.ManualPatch})
});

chrome.runtime.onMessage.addListener((event: ExtensionEvent, sender, sendResponse) => {
  log("onMessage", event, sender)
  switch (event.type) {
    case ExtensionEventType.ReadConfiguration:
      getConfigurationAsync().then(configuration => sendResponse(configuration));
      break;
    default:
      error("unexpected event type", event);
      sendResponse();
  }
  return true;
});

chrome.storage.onChanged.addListener(async (_, areaName) => {
  log("storage.onChanged");
  if (areaName !== 'sync') {
    return;
  }
  const configuration = await getConfigurationAsync();
  chrome.tabs.query({url: `*${ GMAIL_URL_SKELETON }*`}, tabs => {
    tabs.forEach(tab => {
      log("sending updated configuration to tab", tab);
      messageTab(tab, {type: ExtensionEventType.ConfigurationContent, configuration});
    });
  });
});
