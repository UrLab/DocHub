import React, { useState } from 'react';
import Tag from './Tag.js';
import Cookies from 'js-cookie';

import { markdown } from 'markdown';
import moment from 'moment';
import PropTypes from 'prop-types';

import { UpvoteButton, DownvoteButton } from './Vote.js';

const CourseDocument = ({
  id, user_vote, votes, is_ready, has_perm: editable, date, description,
  name, pages, is_unconvertible, tags, is_processing, user,  }) => {

  const [ {
    upvote_active, downvote_active,
    upvotes, downvotes
  }, setState ] = useState({
    upvote_active : user_vote==1 || false,
    downvote_active : user_vote==-1 || false,
    upvotes : votes.upvotes || 0,
    downvotes : votes.downvotes || 0
  });

  const formatted_date = moment(date).format("D MMMM YYYY");
  const desc_text = markdown.toHTML(description);

  const vote_callback = e => {
    $.get(Urls.document_detail(id), data => {
      setState({
        upvote_active: data.user_vote==1,
        downvote_active: data.user_vote==-1,
        upvotes: data.votes.upvotes,
        downvotes: data.votes.downvotes
      });
    })
  }

  return (
    <div className="row course-document">
      <div className="large-12 columns">
        <div className="panel">
          <div className="right">
            <a href={ is_ready ?
              Urls['document-pdf'](id)
            :
              Urls['document-original'](id)
            } title="Télécharger"
              className="radius label tiny secondary">
              <i className="fi-download dark-grey"/> Télécharger
            </a>
            {' '}{ is_ready && editable &&
              <a href={ Urls.document_edit(id) }
                title="Éditer"
                className="radius label tiny secondary">
                <i className="fi-pencil dark-grey"/> Editer
              </a>
            }
            {' '}{ is_ready && editable &&
              <a href={ Urls.document_reupload(id) }
                className="radius label tiny secondary">
                <i className="fi-page-add dark-grey"
                  title="Ré-uploader"/> Ré-uploader
              </a>
            }
          </div>
          <h5>
            { is_ready ?
              <a href={ Urls.document_show(id) }>{ name }</a>
            :
              <span>{ name }</span>
            }
            <small> par { user.name }</small><br/>
          </h5>
          { desc_text != '' &&
            <p dangerouslySetInnerHTML={{
              __html: markdown.toHTML(desc_text)
            }}
              className="document-description"/>
          }

          <div className="right">
            <i className="fi-star vote-color"/> Votez :
            &nbsp;
            {
              <UpvoteButton
                doc_id={id}
                num={upvotes}
                isActive={upvote_active}
                vote_callback={vote_callback} />
            }{' '}{
              <DownvoteButton
                doc_id={id}
                num={downvotes}
                isActive={downvote_active}
                vote_callback={vote_callback}
              />
            }
          </div>

          <div className="course-content-last-line">
            <i className="fi-page-filled"/>
            { !is_ready ?
              <span> En cours de traitement</span>
            : pages == 1 ?
              <span>1 page</span>
            : is_unconvertible ?
              <span/>
            :
              <span>{pages}{' '}pages</span>
            }
            {' '}<i className="fi-clock"/> Uploadé le { formatted_date }&nbsp;
            { tags.length > 0 &&
              <span>
                <i className="fi-pricetag-multiple"/>
                { tags.map(tag => (
                  <Tag key={tag.id} {...tag}/>
                ))}
              </span>
            }
          </div>
        </div>
      </div>
    </div>
  )
}


export default CourseDocument;
