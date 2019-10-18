import React from "react";
import { useContainer } from "./store";
import Welcome from "./Welcome.js";
import FeedEntry from "./FeedEntry";
import { Link } from "react-router-dom";

const Home = () => {
  const { store:
    {
      user,
      faculties,
      recent_docs,
      stream
    }
  } = useContainer();
  return (
    <div>
      { user.welcome &&
        <Welcome />
      }
      <br/>
      { user.followed_courses.length>0 &&
        <div className="row">
          <div className="large-6 columns">
            <h3>Documents récents</h3>
            <ul className="no-list">
              { recent_docs.map(doc => (
                <li key={ doc.id }>
                  <Link to={ Urls["document_show"](doc.id) }>
                    <span className="course-label secondary radius label recent-blob fixed-label">
                      { doc.course.slug }
                    </span>
                    { doc.name.substring(0, 40) }
                  </Link>
                  </li>
              ))}
            </ul>
          </div>
          <div className="large-6 columns">
            <h3>Mes cours</h3>
            <ul className="no-list">
              { user.followed_courses.map(course => (
                <li key={ course.id } className="nav-link">
                  <Link to={ Urls.course_show(course.slug) }>
                    <span className="course-label success radius label fixed-label">
                      { course.slug }
                    </span>
                    { course.name.substring(0, 40) }
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      }
      { user.followed_courses.length<3 &&
        <div className="row">
          <div className="large-6 columns">
            <h3>Abonne toi à des cours</h3>
            <p>
              Sur DocHub, tu peux mettre des cours en favoris.
              Ca te permet de voir directement dans ton flux d'actualités,
              de recevoir des notifications dans la barre du haut et tout simplement
              d'y accéder facilement.<br/>
              Les cours de DocHub sont classés par faculté ici à droite ou via le menu dans
              <span className="label secondary radius">
                <i className="fi-torso"></i>
                {" "}{ user.first_name }
                {" "}<i className="fi-play"></i>
                {" "}Mes cours
              </span>.<br/>
              Tu peux aussi directement chercher ton cours dans la barre de recherche.
            </p>
          </div>
          <div className="large-6 columns">
            <h3>Facultés</h3>
            <ul className="small-block-grid-1">
              { faculties.map(fac => (
                <li key={ fac.id } className="catalog-option">
                  <Link to={ Urls["category_show"](fac.id) }>
                    <i className="fi-folder round-icon small"></i>
                    {" "}{ fac.name }
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      }
      <div className="row">
        <div className="large-12 columns feed">
          <h4>Flux d'actualités</h4>
          { stream.map(action => (
            <FeedEntry key={action.id} action={action} />
          ))}
          { stream.length==0 &&
            <span>
              { user.followed_courses.length>0 ?
                <p>Il n'y a encore rien dans ton flux d'actualités, attends un peu, ça arrivera&nbsp;!</p>
              :
                <span>
                  <p>Il n'y a encore rien dans ton flux d'actualités, il faudrait peut-être <Link to={ Urls["show_courses"]() }>s’abonner à un cours</Link> ?</p>
                  <p>En vous abonnant à un cours, il apparait dans le menu de gauche sur toutes les pages du site, et vous recevez une notification à chaque nouveau document ou sujet de discussion ajouté dans ce cours.</p>
                </span>
              }
              <span id="joy-flux"></span>
              { Array.from("xxxx").map((_, i) => (
                <div key={i} className="row feed-placeholder">
                  <div className="large-12 columns">
                    <p>
                      <strong>
                        <i className="fi-cloud"></i>
                        <img src="//placehold.it/40x40" className="feed-photo"/> John Doe a commenté
                      </strong>
                      {" "}"Question pour l'examen" dans Bases Fondamentales (base-f-100)
                      <br/>
                      <span className="feed-timesince">
                        Il y a 10 minutes
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </span>
          }
        </div>
      </div>
    </div>
  )
}

export default Home;
