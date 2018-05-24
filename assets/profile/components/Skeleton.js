import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';

import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';

import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import MetisMenu from 'react-metismenu';
import '../css/sidetree.sass';

import _ from 'lodash';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { membersOperations } from '../ducks/members/';
import { coursesOperations } from '../ducks/courses/';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};


const SideTree = ({ content }) => {
  const courseToMenu = parent => {
      return course => {
          return {
              icon: 'book',
              label: `${course.slug} ${course.name}`,
              to: `/catalog/course/${course.slug}#_${parent}`
          };
      };
  };

  const categoryToMenu = parent => {
      return category => {
          let subcategories = category.children.map(categoryToMenu(category.id));
          let courses = category.courses.map(courseToMenu(category.id));
          return {
              icon: 'folder',
              label: category.name,
              to: `/catalog/category/${category.id}#_${parent}`,
              content: subcategories.concat(courses)
          };
      };
  };

  if (content) {
    const menuContent = content[0].children.map(categoryToMenu(""));

    return (
      <MetisMenu
        content={menuContent}
        iconNamePrefix='fi-'
        activeLinkFromLocation
      />
    );
  }

  return (
    <div>loading</div>
  );
}


class CourseTreeComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      treemenu: false,
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  toggleDrawer = (open) => () => {
    this.setState({
      treemenu: open,
    });
  };

  componentWillMount() {
    this.props.fetchTree();
  }

  render() {
    const { tree } = this.props;

    return (
      <div>
        <IconButton onClick={this.toggleDrawer(true)} color="inherit" aria-label="Menu">
          <MenuIcon />
        </IconButton>
        <Drawer open={this.state.treemenu} onClose={this.toggleDrawer(false)}>
          <div
            tabIndex={0}
            role="button"
          >
            <SideTree content={tree}/>
          </div>
        </Drawer>
      </div>
    );
  }
}

const mapDispatchToPropsCourseTree = dispatch => ({
  fetchTree: () => dispatch(coursesOperations.fetchTree()),
});

const mapStateToPropsCourseTree = ({ courses: { tree } }) => ({
  tree
});

const CourseTree = connect(mapStateToPropsCourseTree, mapDispatchToPropsCourseTree)(CourseTreeComponent);

const Footer = () => (
  <footer className="text-center">
    <hr/>
    <br/>
    Made with love at
    <a href="https://urlab.be">
      <img src="/static/images/urlab.png" style={{"height": "1em"}}/>
      UrLab
    </a>
    - Code on <a href="https://github.com/UrLab/beta402">GitHub</a>
    - <a href="https://cerkinfo.be">
        <img src="/static/images/ci.png" style={{"height": "1em"}}/>
      </a>
    - <a href="/api">API</a>
    <br/>
  </footer>
);

class Skeleton extends React.Component {
  componentWillMount() {
    this.props.fetchSelf();
  }

  state = {
    anchorEl: null,
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;

    const auth = this.props.self;

    const { anchorEl } = this.state;
    const open  = Boolean(anchorEl);

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <CourseTree classes/>
            <Typography variant="title" color="inherit" className={classes.flex}>
              DocHub
            </Typography>
            {auth && (
              <div>
                <IconButton
                  aria-owns={open ? 'menu-appbar' : null}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={() => {this.handleClose(); window.location.href = "/users/settings/"}}>Profil</MenuItem>
                  <MenuItem onClick={() => {this.handleClose(); window.location.href = "/logout/";}}>Se déconnecter</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
        {this.props.children}
        <Footer/>
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

export default withStyles(styles)(withRouter(connect(mapStateToProps, mapDispatchToProps)(Skeleton)));
