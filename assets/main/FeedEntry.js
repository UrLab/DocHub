import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

moment.locale('fr');

const FeedEntry = ({action}) => {
  return (
    <div className="row">
      <div className="large-12 columns">
        <p>
          <strong>
            { action.verb=="a posté" &&
              <i className="fi-comment"/>
            }
            { action.verb=="a édité" &&
              <i className="fi-pencil"/>
            }
            { action.verb=="a répondu" &&
              <i className="fi-comments"/>
            }
            { action.verb=="a uploadé" &&
              <i className="fi-page-add"/>
            }
            <img src={action.actor.get_photo} className="feed-photo" />
            {' '}{ action.actor.fullname }
            {' '}{ action.verb }
          </strong>
          { !!action.action_object &&
            <span> <Link to={ action.action_object.get_absolute_url }>
              { action.action_object.fullname }
            </Link></span>
          }
          { !!action.target &&
            <span> dans
              {' '}<Link to={ action.target.get_absolute_url }>
                { action.target.fullname }
              </Link>
            </span>
          }
          <br/>
          <span className="feed-timesince">
            { moment(action.timestamp).fromNow() }
          </span>

        </p>
      </div>
    </div>
  )
}

export default FeedEntry;
