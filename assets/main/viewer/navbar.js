import React, { Component } from 'react';
import { Link } from 'react-router-dom';

var menuIconStyle = {
    paddingRight: "1em"
}

const Navbar = ({
    course_name, docname, docid, course_slug,
    zoomin, zoomout, is_pdf, has_perm
  }) => {
  return (
    <div className="sticky contain-to-grid">
      <nav className="top-bar" id="navbar" data-topbar="">
        <ul className="title-area">
          <li className="name">
            <h2>
              <a href="#">
                { docname }
              </a>
            </h2>
          </li>

          <li className="toggle-topbar menu-icon">
            <a href="#" style={menuIconStyle}>
              Menu <i className="fi-list" />
            </a>
          </li>
        </ul>

        <section className="top-bar-section">
          <ul className="left">
            <li>
              <Link to={Urls.course_show(course_slug)}>
                <i className="fi-arrow-left" /> {course_name}
              </Link>
            </li>

            {is_pdf == "True" ?
              <li>
                <a  href={Urls['document-pdf'](docid)}>
                  <i className="fi-download" /> Télécharger
                </a>
              </li>
            :
              <li className="has-dropdown">
                <a href="#">
                  <i className="fi-download" /> Télécharger
                </a>
                <ul className="dropdown">
                  <li>
                    <a href={Urls['document-original'](docid)}>
                      Original
                    </a>
                  </li>
                  <li>
                    <a href={Urls['document-pdf'](docid)}>
                      PDF
                    </a>
                  </li>
                </ul>
              </li>
            }
          </ul>
          <ul className="right">
            <li>
              <ul className="button-group navbar-button">
                { has_perm == "1" &&
                  <li>
                    <Link className="button navbar-button"
                      to={Urls.document_edit(docid)}>
                      <i className="fi-pencil" />
                    </Link>
                  </li>
                }
                <li>
                  <a className="button navbar-button" href="#" onClick={zoomin}>
                    <i className="fi-zoom-in" />
                  </a>
                </li>
                <li>
                  <a className="button navbar-button" href="#" onClick={zoomout}>
                    <i className="fi-zoom-out" />
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </section>
      </nav>
    </div>
  );
}

export default Navbar;
