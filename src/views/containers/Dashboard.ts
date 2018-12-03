import { connect } from 'react-redux';

import { RootState } from '@src/redux/state';

import Dashboard from '@src/views/components/Dashboard';

const mapStateToProps = (state: RootState, ownProps: {}) => {
  return { ...state };
};

export default connect<{}>(
  mapStateToProps,
  {}
)(Dashboard);
