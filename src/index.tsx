// React
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// Redux
import configureStore, { history } from './redux/store';
import { ConnectedRouter } from 'react-router-redux';

// Providers
import { LocaleProvider } from 'antd';
import { Provider as ReduxProvider } from 'react-redux';
import enUS from 'antd/lib/locale-provider/en_US';

import EthSurvey from './views/EthSurvey';

const reduxStore = configureStore();

ReactDOM.render(
  <LocaleProvider locale={enUS}>
    <ReduxProvider store={reduxStore}>
      <ConnectedRouter history={history}>
        <EthSurvey />
      </ConnectedRouter>
    </ReduxProvider>
  </LocaleProvider>,
  document.getElementById('ethsurvey')
);
