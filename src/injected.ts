import "gmail-js";
// @ts-ignore
import $ from "jquery";
import { setRecipient, unsetRecipient } from "./util/setRecipient";
import { addEventListener, dispatchEvent } from "./util/windowEvents";
import { ExtensionEvent, ExtensionEventType } from "./util/event";
import { anyInDomain, anyMatches, anyNotInDomain, contains, doesNotContain } from "./util/match";
import { cleanEmail, formatWithInbox, getDomain, isNotEmptyString } from "./util/emailFormat";
import { Configuration, ToType } from "../common/configuration";
import { error, log } from "../common/log";
// @ts-ignore
const GmailFactory = require("gmail-js");

// @ts-ignore
const gmail: Gmail = window._gmailjs = window._gmailjs || new GmailFactory.Gmail($);

log("Extension loading...");

class ExtensionState {
  public patchedComposeIds = new Set<string>();
  public manuallyPatchedComposeIds = new Set<string>();

  constructor(
    public configuration: Configuration | null = null
  ) {
  }
}

const extensionState = new ExtensionState();

addEventListener(ExtensionEventType.ConfigurationContent, (event: ExtensionEvent) => {
  extensionState.configuration = event.configuration || null;
  log("loaded configuration from storage", extensionState);
});

addEventListener(ExtensionEventType.ManualPatch, () => manualPatch());

gmail.observe.on("load", () => {
  log("gmail loaded", extensionState, gmail.get.user_email());
  dispatchEvent({type: ExtensionEventType.InjectionLoaded});
  gmail.observe.on("recipient_change", onRecipientChange);
});

function shouldPatch(compose: GmailDomCompose, recipients: string[]) {
  const domain = getDomain(gmail.get.user_email());
  const recipientsSet = new Set<string>(recipients);

  switch (extensionState.configuration!.toType) {
    case ToType.Everyone:
      return true;

    case ToType.NoOne:
      return false;

    case ToType.AnyoneInDomain:
      return anyInDomain(recipients, domain);

    case ToType.AnyoneOutsideDomain:
      return anyNotInDomain(recipients, domain);

    case ToType.EveryoneExceptFor:
      return doesNotContain(recipientsSet, extensionState.configuration!.toExplicitList!);

    case ToType.NoOneExceptFor:
      return contains(recipientsSet, extensionState.configuration!.toExplicitList!);

    default:
      error("unhandled toType", extensionState.configuration!.toType);
      return false;
  }
}

function onRecipientChange(compose: GmailDomCompose, recipients: GmailDomComposeRecipients) {
  try {
    log("recipient_change", `compose.id=${ compose.id() }`, recipients, extensionState);

    const {configuration} = extensionState;
    if (configuration === null) {
      log("no configuration - no action");
      return;
    }

    const composeFrom = compose.from();
    if (isNotEmptyString(composeFrom) && composeFrom !== configuration.from) {
      log("'from' is not matching configuration - no action", composeFrom);
      return;
    }

    const destination = formatWithInbox(configuration.destination, configuration.inbox);

    const allRecipients = [...recipients.to, ...recipients.cc, ...recipients.bcc].map(email => cleanEmail(email));

    const isComposePatched = extensionState.patchedComposeIds.has(compose.id());
    const isComposeManuallyPatched = extensionState.manuallyPatchedComposeIds.has(compose.id());
    if (isComposePatched && !isComposeManuallyPatched && !shouldPatch(compose, allRecipients)) {
      log("patched but state changed to require un-patching!");
      unsetRecipient(compose, configuration.recipientType, destination);
      extensionState.patchedComposeIds.delete(compose.id());
      return;
    }
    if (allRecipients.length === 0 || isComposePatched || isComposeManuallyPatched || anyMatches(allRecipients, destination)) {
      log("no need to patch - no action");
      return;
    }

    if (!shouldPatch(compose, allRecipients)) {
      log("configuration logic says not to patch");
      return;
    }

    setRecipient(compose, configuration.recipientType, destination);
    extensionState.patchedComposeIds.add(compose.id());
    log("patched!");
  } catch (e) {
    error("recipient_change handling failed", extensionState, e);
  }
}

const topmost = (c1: GmailDomCompose, c2: GmailDomCompose): GmailDomCompose =>
  c1.is_inline() ? c2 : c1;

function manualPatch() {
  const {configuration} = extensionState;
  if (configuration === null) {
    log("no configuration - no action");
    return;
  }

  const composes = gmail.dom.composes();

  if (composes.length === 0) {
    log("no composes around");
    return;
  }

  const topCompose = composes.reduce((c1, c2) => topmost(c1, c2));

  // @ts-ignore
  const allRecipients = topCompose.recipients({flat: true}).map(email => cleanEmail(email));
  const destination = formatWithInbox(configuration.destination, configuration.inbox);

  if (anyMatches(allRecipients, destination)) {
    log("already patched - no action");
    return;
  }

  setRecipient(topCompose, configuration.recipientType, destination);
  extensionState.patchedComposeIds.add(topCompose.id());
  extensionState.manuallyPatchedComposeIds.add(topCompose.id());
  log("manually patched!", `compose.id=${ topCompose.id() }`);
}
