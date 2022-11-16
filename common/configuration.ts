export type Email = `${ string }@${ string }`;

export enum RecipientType {
  cc = 'cc',
  bcc = 'bcc'
}

export enum ToType {
  Everyone = 'Everyone',
  AnyoneInDomain = 'AnyoneInDomain',
  AnyoneOutsideDomain = 'AnyoneOutsideDomain',
  EveryoneExceptFor = 'EveryoneExceptFor',
  NoOneExceptFor = 'NoOneExceptFor',
  NoOne = 'NoOne',
}

export type Configuration = {
  from: Email,
  toType: ToType,
  toExplicitList: Email[] | null
  recipientType: RecipientType,
  destination: Email,
  inbox: string | null
}