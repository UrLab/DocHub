import React from 'react';
import Tag from './Tag.js';
import Cookies from 'js-cookie';

import { markdown } from 'markdown';
import moment from 'moment'
import PropTypes from 'prop-types';
import axios from 'axios';

const VoteButton = ({
    isActive, doc_id, vote_type, vote_callback, num,
    description, icon_class }) => {

  const clicked = e => {
    e.preventDefault();
    if (!isActive) {
      axios.post(
        Urls.document_vote(doc_id),
        { vote_type : vote_type }
      )
      .then(({data}) => {
        vote_callback(data);
      })
    }
  }

  const pretty_vote_num = (
    (num < 1000) ?
      num.toString()
    :
      ((num / 1000).toFixed(1).toString()) + "k"
    )

  return (
    <a
      title={ description }
      className={ "label radius " + (isActive ? 'info' : 'secondary') }
      onClick={ clicked }>
      <i className={`${icon_class} ${isActive ? 'active' : ''}`} />
      &nbsp;
      { pretty_vote_num }
    </a>
  )
};

export const UpvoteButton = props => (
  <VoteButton {...props}  // isActive, vote_callback, num
    vote_type={"up"}
    label_class={"round success label votelabel"}
    icon_class={"fi-like round-icon medium upvote"}
    description="Ce document est très utile et mérite plus d'attention"
  />
)

export const DownvoteButton = props => (
  <VoteButton {...props} // isActive, vote_callback, num
    vote_type={"down"}
    label_class={"round alert label votelabel"}
    icon_class={"fi-dislike round-icon medium downvote"}
    description="Ce document est décevant et/ou inintéressant pour le cours"
  />
)
