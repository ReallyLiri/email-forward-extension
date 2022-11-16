import { Email } from "../../common/configuration";
import { log } from "../../common/log";

export const isNotEmptyString = (s: string | null) =>
  s && s.length > 0;

export const formatWithInbox = (email: Email, inbox: string | null): Email => {
  if (!inbox || inbox.length === 0) {
    return email;
  }
  const parts = email.split('@');
  if (parts.length !== 2) {
    return email;
  }
  return `${ parts[0] }+${ inbox }@${ parts[1] }`;
}

export const cleanEmail = (email: string): string => {
  if (email.indexOf("<") > 0) {
    // handle "display name <email@domain>"
    const parts = email.split("<");
    email = parts[parts.length - 1].replace(">", "");
  }
  return email.toLowerCase();
}

export const getDomain = (email: string): string => {
  email = cleanEmail(email);
  const parts = email.split('@');
  if (parts.length !== 2) {
    log("no @ found in email", email);
    return email;
  }
  return parts[1].trim().toLowerCase();
}
