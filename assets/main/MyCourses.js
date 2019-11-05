import React from 'react';
import { useContainer } from './store';
import { with_fetch, useFetch } from './Fetch.js';
import moment from 'moment';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyCourses = () => {
  // {% block title %}Liste des cours{% endblock %}

  const { store: { user, suggestions, faculties } } = useContainer();

  const cls = ( user.followed_courses.length<1 ?
    "large-12"
  :
    "large-8" )+' medium-12 columns';

  const cls2 = ( user.followed_courses.length<0 ?
    "large-12"
  :
    "large-4")+' medium-12 columns';

  const show_unfollow_button = [7, 8, 9, 10].includes(moment().month());

  const fetch = useFetch();

  const unfollow_all_courses = e => {
    axios.get(Urls.unfollow_all_courses())
    .then(res => {
      fetch({ endpoint: '/api/me/', store_as: 'user' })
    })
    .catch(err => {
      console.log(err)
    })
  }

  return (
    <div className="row">
      <div className={ cls }>
        { user.followed_courses.length<1 ?
          <div>
            <h1>Mes cours</h1>
            <p>On dirait que tu n'es abonné à aucun cours pour le moment.<br/>
              Tu pourrais parcourir le catalogue de DocHub et
              {' '}<span data-tooltip aria-haspopup="true"
                className="has-tip"
                title="En vous abonnant à un cours, vous recevrez une notification quand quelqu'un ajoute un document ou pose une question.">
                t'abonner
              </span>
              {' '}aux cours qui t'intéressent.
            </p>
            <div className="alert-box radius secondary medium-8">
              <i className="fi-info" /> En t'abonnant à un cours, tu recevras une notification quand quelqu'un ajoute un document ou pose une question.
            </div>
          </div>
        :
          <div>
            <h1>Cours
              { show_unfollow_button &&
                <a onClick={ unfollow_all_courses }
                  className="button alert right">
                  Me désabonner de tous les cours
                </a>
              }
            </h1>
            <ul className="course-list">
              { user.followed_courses.map(course => (
                <li key={ course.slug }>
                  <Link to={ Urls.course_show(course.slug) }>
                    <span className="course-label radius success label">
                      { course.slug }
                    </span>
                    {' '}{ course.name }
                  </Link>
                </li>
              ))}
            </ul>

            {  suggestions &&
              <div>
                <h3>Suggestions</h3>
                Ces cours-ci semblent similaires aux tiens, tu pourrais t'y abonner.
                <ul className="course-list">
                  { suggestions.map((course, rank) => (
                    <li key={ course.slug }>
                      <Link to={ Urls.course_show(course.slug) }>
                        <span className="course-label radius info label">
                          { course.slug }
                        </span>
                        {' '}{ course.name }
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            }
          </div>
        }
      </div>

      <div className={ cls2 }>
        <h1>Catalogue</h1>
        Tu peux aussi aller voir tous les autre cours de l'ULB.
        Ils sont classés par faculté, section et année.<br/><br/>
        <ul className="small-block-grid-1">
          { faculties.map(fac => (
            <li key={ fac.id } className="catalog-option">
                <Link to={ Urls.category_show(fac.id) }>
                  <i className="fi-folder round-icon small" />
                  {' '}{ fac.name }
                </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default with_fetch(MyCourses, [
  { endpoint: '/api/me/', store_as: 'user' },
  { endpoint: "/spa/subscribed_courses/" }
]);
