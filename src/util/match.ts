import { getDomain } from "./emailFormat";

export const emailMatches = (email: string, query: string) =>
  email.toLowerCase().includes(query.toLowerCase());

export const anyMatches = (emails: string[], query: string) =>
  emails.some(email => emailMatches(email, query));

export const anyInDomain = (emails: string[], domain: string) =>
  emails.some(email => getDomain(email) === domain);

export const anyNotInDomain = (emails: string[], domain: string) =>
  emails.some(email => getDomain(email) !== domain);

export const doesNotContain = (recipients: Set<string>, excludeList: string[]) =>
  excludeList.every(email => !recipients.has(email));

export const contains = (recipients: Set<string>, includeList: string[]) =>
  includeList.some(email => recipients.has(email));
