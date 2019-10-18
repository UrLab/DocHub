import React from 'react';
import { useContainer } from './store';
import { with_fetch } from "./Fetch.js";
import { Link } from 'react-router-dom';
import { isFollowed } from './utils.js';

const Categories = () => {
  const { store : { category, user } } = useContainer();
  // {% block title %}{{ category.name }}{% endblock %}

  return (
    <div>
      <div className="row">
        <div className="medium-12 columns">
          <h1>{ category.name }</h1>
        </div>
      </div>

      <div className="row">
        <div className="small-12 large-12 columns">
          <ul className="breadcrumbs">
            { category.ancestors.map(parent => (
              <li key={parent.id}>
                <Link to={ Urls.category_show(parent.id) }>
                  { parent.name }
                </Link>
              </li>
            ))}
            <li className="current">
              <a href="#">{ category.name }</a>
            </li>
          </ul>
        </div>
        <br/>
        { category.courses.length>0 &&
          <div className="large-6 medium-12 columns">
            <h3>Cours</h3>
            <ul className="course-list">
              { category.courses.map(course => {
                const followed = isFollowed(user.followed_courses, course);
                return (
                  <li key={course.id}>
                    <h6>
                      { followed ?
                        <a href={ Urls.leave_course(course.slug)+"?next="+Urls.category_show(category.id) }
                           className="course-label radius success label toggle-follow"
                           title="Se désabonner du cours">
                          { course.slug }
                        </a>
                      :
                        <a href={ Urls.join_course(course.slug)+"?next="+Urls.category_show(category.id) }
                           className="course-label secondary radius label toggle-follow"
                           title="S'abonner au cours">
                          { course.slug }
                        </a>
                      }

                      <Link to={ Urls.course_show(course.slug) }>
                        {" "}{ course.name }
                      </Link>

                      { followed &&
                        <small> (abonné)</small>
                      }
                    </h6>
                  </li>
                )
              })}
            </ul>
          </div>
        }

        { category.children.length>0 &&
          <div className="large-6 medium-12 columns">
            <ul className="small-block-grid-1">
              { category.children.map(cat => (
                <li key={cat.id} className="catalog-option">
                  <h6>
                    <Link to={ Urls.category_show(cat.id) }>
                      <i className="fi-folder round-icon small"></i>
                      {' '}{ cat.name }
                    </Link>
                  </h6>
                </li>
              ))}
            </ul>
          </div>
        }

          <div className="medium-6 columns">
              <div className="panel callout radius">
                <h5>Tu ne trouves pas ta section ou ton cours ?</h5>
                <p>
                    Il est peut-être juste manquant de notre classification.
                    Mais si il était sur Respublicae, nous on l'a aussi !<br/>
                    Fais une recherche sur le nom ou le mnémonique de ton cours dans la barre de recherche
                    et tu le trouveras surement.<br/>
                    <small>(Si jamais tu ne le trouves vraiment pas, envoie nous un message, on réparera ça tout de suite.)</small>
                </p>
              </div>
          </div>

      </div>
    </div>
  )
}

export default with_fetch(Categories, [
  { prefix : "/api", store_as : "category" },
  { endpoint : "/api/me/", store_as : "user" }
]);
