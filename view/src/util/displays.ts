import { RecipientType, ToType } from "../../../common/configuration";

export const TO_TYPE_TO_DISPLAY_NAME: Record<ToType, string> = {
  [ToType.Everyone]: "Everyone",
  [ToType.AnyoneInDomain]: "Anyone within my email domain",
  [ToType.AnyoneOutsideDomain]: "Anyone outside my email domain",
  [ToType.EveryoneExceptFor]: "No one from this list",
  [ToType.NoOneExceptFor]: "Anyone from this list",
  [ToType.NoOne]: "No one"
}

export const RECIPIENT_TYPE_TO_DISPLAY_NAME: Record<RecipientType, string> = {
  [RecipientType.cc]: "CC",
  [RecipientType.bcc]: "BCC"
}
