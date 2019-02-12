import * as React from 'react';
import { Layout } from 'antd';
import { Route } from 'react-router';
import { connect } from 'react-redux';

// Components
import Header from '@src/views/components/Header';

// Redux
import * as Web3Actions from '@src/redux/modules/web3/actions';
import { RootState } from '@src/redux/state';

// Styles
import '../less/app.less';

// Routes
import { routes } from '../routes';
import { NULL_ADDRESS } from '@src/core/constants';

const mapStateToProps = (state: RootState) => {
  return { ...state };
};

interface EthSurveyProps extends RootState {
  initWeb3: () => {};
}

class EthSurvey extends React.Component<EthSurveyProps> {
  componentDidMount() {
    this.props.initWeb3();
  }

  render() {
    const { router, web3State } = this.props;

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header
          account={
            web3State.get('accounts').size > 0
              ? web3State.get('accounts').get(0)
              : NULL_ADDRESS
          }
          {...router}
        />
        {routes.map(route => (
          <Route key={route.path} {...route} />
        ))}
      </Layout>
    );
  }
}

export default connect<{}>(
  mapStateToProps,
  {
    initWeb3: Web3Actions.InitWeb3
  }
)(EthSurvey);
