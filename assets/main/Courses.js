import React, { useCallback } from 'react';
import { useContainer } from "./store";
import { with_fetch } from "./Fetch.js";
import CourseDocumentList from './courses/CourseDocumentList.js';
import axios from 'axios';
import { isFollowed } from './utils.js';

const Courses = () => {
  // {% block title %}{{ course.slug|upper }}{% endblock %}
  const { store: { course, user }, setStore } = useContainer();
  const followed = isFollowed(user.followed_courses, course);

  const hit_api = url => useCallback(e => {
    console.log("click")
    console.log(url)
    e.preventDefault();
    axios.get(url, {
      headers: {
        "Cache-Control": "no-cache" 
      }
    })
    .then(({data}) => {
      setStore({user: data})
      console.log("done")
    })
    .catch(err => {
      console.log(err)
    })

    console.log("fin")
  }, [user.followed_courses])
  console.log("render")
  return (
    <div>
      <div className="row">
        <div className="large-12 columns">
          <h1>
            { course.slug.toUpperCase() } { course.name }
            { followed &&
              <i className="fi-check green"/>
            }
            { course.followers_count > 1 &&
              <small>{ couse.followers_count } personnes sont abonnées à ce cours.</small>
            }
          </h1>
          <div>
            <a href={ course.gehol_url } target="_blank" className="button radius tiny secondary right">
              <i className="fi-calendar"/> Horaire sur GeHol
            </a>
            <a href={ Urls.document_put(course.slug) } className="button radius tiny success">
              <i className="fi-plus"/> Uploader un fichier
            </a>
            {" "}{ followed ?
              <a onClick={ hit_api(Urls.leave_course(course.slug)) } className="button radius info tiny">
                <i className="fi-x"/> Se désabonner
              </a>
            :
              <a onClick={ hit_api(Urls.join_course(course.slug)) } className="button radius info tiny">
                <i className="fi-check"/> S’abonner au cours
              </a>
            }
          </div>
        </div>
      </div>
      <div className="row">
        <div className="large-12 medium-12 columns">
          <div className="tabs-content">
            <div className="content active" data-id={ course.slug }>
              <CourseDocumentList document_set={ course.document_set } />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default with_fetch(Courses, [
  {prefix: "/api", store_as: "course"},
  {endpoint: "/api/me/", store_as: "user"}
]);
