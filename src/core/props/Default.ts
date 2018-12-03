import { RouteComponentProps } from 'react-router';

import { Web3State } from '@src/redux/modules/web3';

export interface DefaultProps extends RouteComponentProps<{ id: string }> {
  web3State: Web3State;
}
