import React from 'react';
import _ from 'lodash';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { membersOperations } from '../ducks/members/';

class Skeleton extends React.Component {
  componentWillMount() {
    this.props.fetchSelf();
  }

  render() {
    return (
      <div className="container">
        <div className="row">
        </div>

        {this.props.children}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchSelf: () => dispatch(membersOperations.fetchSelf()),
  fetchDetail: (uid) => dispatch(membersOperations.fetchDetail(uid)),
});

const mapStateToProps = ({ members: { members, self, }, }) => ({
  members,
  self,
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Skeleton));
