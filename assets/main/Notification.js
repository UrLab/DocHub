import React, { useState } from 'react';
import { with_fetch } from "./Fetch.js";
import { useContainer } from "./store";
import moment from 'moment';
import axios from 'axios';
import { Link, Redirect, useLocation } from 'react-router-dom';
import { useFetch } from './Fetch.js';

const Notification = () => {
  // {% block title %}Notifications{% endblock %}
  const [ redirect, setRedirect ] = useState(null);
  const { store : { notifications } } = useContainer();
  const location = useLocation();

  const fetch = useFetch();

  const hit_api = url => e => {
    e.preventDefault();
    axios.get(url)
    .then(({ data: { redirect: new_url } }) => {
      fetch([
        { endpoint: "/api/notifications/", store_as: "notifications" },
        { endpoint: "/api/me/", store_as: "user" },
      ])
      if (!!new_url && location.pathname!=redirect) {
        setRedirect(new_url);
      }
    })
    .catch(err => {
      console.log(err)
    })
  }

  if (!!redirect) {
    return <Redirect to={redirect} />
  }

  return (
    <div className="row">
      <div className="large-12 columns">
        { notifications.length>0 ?
          <div>
            <h2>
              Notifications
            </h2>
            <a onClick={ hit_api(Urls.read_all()) } className="button radius tiny success">
              <i className="fi-check" style={{ color: "inherit" }} />
              {' '}Tout marquer comme lu
            </a>
            { notifications.map(notification => (
              <div key={ notification.id } className="row">
                <div className="large-12 columns">
                  <p>
                    <strong>
                      { notification.action.verb == "a posté" &&
                        <i className="fi-comment" />
                      }
                      { notification.action.verb == "a édité" &&
                        <i className="fi-pencil" />
                      }
                      { notification.action.verb == "a répondu" &&
                        <i className="fi-comments" />
                      }
                      { notification.action.verb == "a uploadé" &&
                        <i className="fi-page-add" />
                      }
                      { notification.action.verb == "upload success" &&
                        <i className="fi-check" style={{ color: "#368a55"}} />
                      }
                      { notification.action.verb == "upload failed" &&
                        <i className="fi-x" style={{ color: "#cf2a0e" }} />
                      }
                      { notification.action.verb == "a uploadé un doublon de" &&
                        <i className="fi-x" style={{ color: "#cf2a0e" }} />
                      }
                      {' '}
                      <a onClick={ hit_api(Urls.read_and_redirect(notification.id)) } >
                        { !notification.action.public ?
                          <span>
                            { notification.action.verb == "upload success" &&
                              <span>Ton upload a réussi :</span>
                            }
                            { notification.action.verb == "a uploadé un doublon de" &&
                              <span>Tu as uploadé un doublon de</span>
                            }
                            { notification.action.verb == "upload failed" &&
                              <span>Il y a eu une erreur durant la conversion de</span>
                            }
                          </span>
                        :
                          <span>
                            <img src={ notification.action.actor.get_photo } className="feed-photo" />
                            { notification.action.actor.fullname }
                            { notification.action.verb }
                          </span>
                        }
                      </a>
                      { !!notification.action.action_object &&
                        <span> <Link to={ notification.action.action_object.get_absolute_url }>
                          { notification.action.action_object.fullname }
                        </Link></span>
                      }
                      { !!notification.action.target &&
                        <span> dans
                          {' '}<Link to={ notification.action.target.get_absolute_url }>
                            { notification.action.target.fullname }
                          </Link>
                        </span>
                      }
                      <a onClick={ hit_api(Urls.mark_as_read(notification.id)) } style={{ color: "grey" }}>
                        {' '}<i className="fi-x" />
                      </a>
                      <br/>
                      { notification.action.verb == "a uploadé un doublon de" &&
                        <span>
                          Votre doublon a été supprimé.
                        </span>
                      }
                      <span className="feed-timesince">
                        {' '}{ moment(notification.action.timestamp).fromNow() }
                      </span>
                    </strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        :
          <div>
            <h2>Notifications</h2>
            <p>
              Tu n'as pas encore de notifications...<br/>
              Attends que quelqu'un ajoute un document ou une question dans un cours que tu suis et tu le verras apparaitre ici.
            </p>
          </div>
        }
      </div>
    </div>
  )
}

export default with_fetch(Notification, {
  endpoint: "/api/notifications/", store_as: "notifications", flatten: true
});
