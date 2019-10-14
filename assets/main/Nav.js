import React from 'react';
import { Link } from 'react-router-dom';
import { StoreContainer } from "./store";
import Search from "./search";

const Nav = () => {
  const {store: {user}} = StoreContainer.useContainer();
  return (
    <div className="sticky contain-to-grid">
      <nav className="top-bar" data-topbar="">
        <ul className="title-area">
          <li className="name">
            <h1><Link to="/">DocHub</Link></h1>
          </li>

            <li className="toggle-topbar menu-icon">
              <Link to="#" style={{paddingRight: "1em"}}>
                Menu <i className="fi-list"/>
              </Link>
            </li>
        </ul>
        { user.is_authenticated &&
          <section className="top-bar-section">
            <ul className="left">
              <li>
                <Link to={Urls['notifications']()}>
                  <i className="fi-megaphone"
                    style={{
                      color: "#cf2a0e" ? user.notification_count > 0 : ""
                    }}/>
                  {" "}<span>{user.notification_count}</span>
                </Link>
              </li>
              <li className="has-form">
                <Search />
                <br/>
              </li>
            </ul>
            <ul className="right">
              <li className="has-dropdown">
                  <a href="#">
                    <i className="fi-torso"/>&nbsp; {user.first_name}
                  </a>
                  <ul className="dropdown">
                      <li>
                        <Link to={Urls['settings']()}>
                          <i className="fi-torso"/>&nbsp; Profil
                        </Link>
                      </li>
                      <li>
                        <Link to={Urls['show_courses']()}>
                          <i className="fi-page"/>&nbsp;
                          Mes cours
                        </Link>
                      </li>
                      { user.is_staff &&
                        <li>
                          <a href="/admin">
                            <i className="fi-widget"/>&nbsp; Admin
                          </a>
                        </li>
                      }
                      <li>
                        <a href={Urls['logout']()}>
                          <i className="fi-power"/>&nbsp; Déconnexion
                        </a>
                      </li>
                  </ul>
              </li>
            </ul>
          </section>
        }
      </nav>
    </div>
  )
}

export default Nav;
