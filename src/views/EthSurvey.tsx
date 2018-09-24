import * as React from 'react';
import { Layout } from 'antd';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import Header from '@src/views/components/Header';

import SurveyArtifact from '@contracts/Survey.sol';

import * as Web3Actions from '@src/redux/modules/web3/actions';
import { RootState } from '@src/redux/state';

// Styles
import '../less/app.less';

// Routes
import { routes } from '../routes';

const mapStateToProps = (state: RootState) => {
  return { ...state };
};

interface EthSurveyProps {
  initWeb3: () => {};
}

class EthSurvey extends React.Component<EthSurveyProps> {
  componentWillMount() {
    console.log(SurveyArtifact);
    // this.props.initWeb3();
  }

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header account={'0x00000000000000000000000000000000000'} />
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
