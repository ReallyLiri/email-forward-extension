export enum Page {
  popup = 'popup',
  options = 'options'
}

if (typeof window === 'undefined') {
  Object.keys(Page).forEach(key => console.log(key))
}
