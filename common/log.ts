const CONTEXT = "EMAIL-FORWARD"

export const log = (message?: any, ...optionalParams: any[]) =>
  console.log(CONTEXT, message, ...optionalParams);

export const error = (message?: any, ...optionalParams: any[]) =>
  console.error(CONTEXT, message, ...optionalParams);
