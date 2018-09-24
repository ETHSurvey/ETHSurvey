import { connect } from 'react-redux';

import { RootState } from '@src/redux/state';

import Create from '@src/views/components/Create';

const mapStateToProps = (state: RootState, ownProps: {}) => {
  return { web3: state.web3 };
};

export default connect<{}>(
  mapStateToProps,
  {}
)(Create);
