declare class Identicon {
  constructor(address: string, size: number);
}

declare module 'identicon.js' {
  export = Identicon;
}
