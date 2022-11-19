import { log } from "../../common/log";
import { RecipientType } from "../../common/configuration";

const CLICK_EVENT = "click";

const ensureFieldVisible = (compose: GmailDomCompose, field: RecipientType) =>
  compose.dom(`show_${ field }`).trigger(CLICK_EVENT);

export const setRecipient = (compose: GmailDomCompose, field: RecipientType, email: string) => {
  log("Setting recipient", field, email);

  ensureFieldVisible(compose, field);

  const jqueryElement = compose.dom(field);

  jqueryElement.val(email);

  // focus on a different box so the injected field will get de-focused
  compose.dom('subjectbox')[0].focus()
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
