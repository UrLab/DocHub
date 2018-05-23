import React from 'react';
import _ from 'lodash';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { membersOperations } from '../ducks/members/';

class Profile extends React.Component {
  componentWillMount() {
    this.props.fetchSelf();
    // this.props.fetchDetail(this.props.match.params.uid);
  }

  render() {
    return (
      <div></div>
    );
  }
}

Profile.defaultProps = {
 self: {},
};

const mapDispatchToProps = dispatch => ({
  fetchSelf: () => dispatch(membersOperations.fetchSelf()),
  fetchDetail: (uid) => dispatch(membersOperations.fetchDetail(uid)),
});

const mapStateToProps = ({ members: { members, self, }, }) => ({
  members,
  self,
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));
