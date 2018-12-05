import { connect } from 'react-redux';

import { RootState } from '@src/redux/state';

import Home from '@src/views/components/Home';

const mapStateToProps = (state: RootState, ownProps: {}) => {
  return { ...state };
};

export default connect<{}>(
  mapStateToProps,
  {}
)(Home);
