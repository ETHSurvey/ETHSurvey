import { connect } from 'react-redux';

import { RootState } from '@src/redux/state';

import TakeSurvey from '@src/views/components/Take';

const mapStateToProps = (state: RootState, ownProps: {}) => {
  return { web3: state.web3 };
};

export default connect<{}>(
  mapStateToProps,
  {}
)(TakeSurvey);
