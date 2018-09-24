import { connect } from 'react-redux';

import { RootState } from '@src/redux/state';

import Home from '@src/views/components/Home';

const mapStateToProps = (state: RootState, ownProps: {}) => {
  return { web3: state.web3 };
};

export default connect<{}>(
  mapStateToProps,
  {}
)(Home);
