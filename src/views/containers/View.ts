import { connect } from 'react-redux';

import { RootState } from '@src/redux/state';

import ViewSurveys from '@src/views/components/View';

const mapStateToProps = (state: RootState, ownProps: {}) => {
  return { ...state };
};

export default connect<{}>(
  mapStateToProps,
  {}
)(ViewSurveys);
