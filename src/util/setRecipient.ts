import { log } from "../../common/log";
import { RecipientType } from "../../common/configuration";

const TAB_KEY_CODE = 9;
const KEYDOWN_EVENT = new KeyboardEvent("keydown", {
  bubbles: true,
  cancelable: true,
  key: "Tab",
  shiftKey: true,
  keyCode: TAB_KEY_CODE
});

const CLICK_EVENT = "click";

const ensureFieldVisible = (compose: GmailDomCompose, field: RecipientType) =>
  compose.dom(`show_${ field }`).trigger(CLICK_EVENT);

export const setRecipient = (compose: GmailDomCompose, field: RecipientType, email: string) => {
  log("Setting recipient", field, email);

  ensureFieldVisible(compose, field);

  const jqueryElement = compose.dom(field);

  jqueryElement.val(email);

  const htmlElement = jqueryElement[0];

  htmlElement.focus();
  htmlElement.dispatchEvent(KEYDOWN_EVENT);
}

export const unsetRecipient = (compose: GmailDomCompose, field: RecipientType, email: string) => {
  ensureFieldVisible(compose, field);

  // @ts-ignore
  const composeQuery = compose.dom();
  const emailRemoveButtonQuery = composeQuery.find(`div.vR > span[email="${ email }"] > div.vM`);
  if (emailRemoveButtonQuery.length !== 1) {
    return;
  }
  emailRemoveButtonQuery.trigger(CLICK_EVENT);
}
