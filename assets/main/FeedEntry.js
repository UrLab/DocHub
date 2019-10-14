import React from 'react';
import moment from 'moment';

const FeedEntry = ({action}) => {
  return (
    <div class="row">
      <div class="large-12 columns">
        <p>
          <strong>
            { action.verb=="a posté" &&
              <i class="fi-comment"/>
            }
            { action.verb=="a édité" &&
              <i class="fi-pencil"/>
            }
            { action.verb=="a répondu" &&
              <i class="fi-comments"/>
            }
            { action.verb=="a uploadé" &&
              <i class="fi-page-add"/>
            }
            <img src={action.actor.get_photo} class="feed-photo" />
            {" "}{ action.actor.fullname }
            {" "}{ action.verb }
          </strong>
          { action.action_object && action.action_object.get_absolute_url ?
            <a href={ action.action_object.get_absolute_url }>{ action.action_object.fullname }</a>
          :
            <span>{ action.action_object.fullname }</span>
          }

          { action.action_object && action.target &&
            <span>dans</span>
          }

          { action.target && action.target.get_absolute_url ?
            <a href={ action.target.get_absolute_url }>{ action.target.fullname }</a>
          :
            <a href={ action.target_url }>{ action.target.fullname }</a>
          }
          <br/>
          <span class="feed-timesince">
            Il y a { moment(action.timestamp).fromNow() }
          </span>

        </p>
      </div>
    </div>
  )
}

export default FeedEntry;
