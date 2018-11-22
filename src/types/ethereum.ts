import { Provider } from 'web3/providers';

export class Ethereum extends Provider {
  enable: () => Promise<{}>;
}
