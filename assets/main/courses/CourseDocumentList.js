import React, { useState } from 'react';
import CourseDocument from './CourseDocument.js';
import Tag from './Tag.js';


const escapeRegExp = str => (
  str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
)

/* http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object */
const clone = obj => {
  var copy;
  if (null == obj || "object" != typeof obj) return obj;
  if (obj instanceof Date){
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }
  if (obj instanceof Array){
    copy = [];
    for (var i=0, len=obj.length; i<len; i++){copy[i] = clone(obj[i]);}
    return copy;
  }
  if (obj instanceof Object){
    copy = {};
    for (var attr in obj){
      if (obj.hasOwnProperty(attr)){copy[attr] = clone(obj[attr]);}
    }
    return copy;
  }
  throw new Error("Unable to copy obj! Its type isn't supported.");
}

const CourseDocumentList = ({document_set}) => {
  const [ tag_filter, set_tag_filter ] = useState([]);
  const [ search_text, set_search_text ] = useState("");

  const has_tag = (doc, tag) => {
    for (var i=0; i<doc.tags.length; i++){
      if (doc.tags[i].id == tag.id){
        return true;
      }
    }
    return false;
  }
  const tags_in_documents = () => {
    var res = {};
    document_set.map(doc => {
      doc.tags.map(t => {
        res[t.id] = t;
      });
    });
    return clone(Object.keys(res).map(k => (res[k])));
  }
  const tag_clicked = tid => e => {
    var i = tag_filter.indexOf(tid);
    if (i >= 0){
      var before = tag_filter.slice(0, i);
      var after = tag_filter.slice(i+1);
      set_tag_filter(before.concat(after));
    } else {
      set_tag_filter(tag_filter.concat([tid]))
    }
  }
  const search_changed = e => {
    set_search_text(e.target.value)
  }

  try {
    var pattern = new RegExp(search_text, 'i');
  } catch(error) {
    var pattern = new RegExp(escapeRegExp(search_text), 'i');
  }
  const documents_filtered = document_set.filter(doc => {
    if (doc.name.search(pattern) < 0){
      return false;
    }
    var admissible = true;
    var dtags = doc.tags.map(tag => (tag.id));
    tag_filter.map(tag => {
      if (dtags.indexOf(tag) < 0) {
        admissible = false;
      }
    });
    return admissible;
  }).sort((a, b) => (a.date >= b.date));
  const bar_tags = tags_in_documents().map(tag => {
    var occurences = documents_filtered
      .map(x => has_tag(x, tag))
      .reduce((x, y) => (x+y), 0);
    tag.active = (tag_filter.indexOf(tag.id) >= 0);
    tag.name += " (" + occurences + ")";
    return tag;
  });


  return (
    <div>
      <div className="row course-top">
        <div className="column small-7">
          <h4>Filtrer <small>par tag</small></h4>
          <span className="tag-bar">
            { bar_tags.map(tag => (
              <Tag key={tag.id} onClick={tag_clicked(tag.id)} {...tag}/>
            ))}
          </span>
        </div>
        <div className="column small-5">
          <h4>Chercher <small>dans le titre</small></h4>
          <input type="text" onChange={ search_changed }/>
        </div>
      </div>
      <br/>
      { documents_filtered.length > 0 ?
        <div>
          { documents_filtered.map(doc => (
            <CourseDocument key={ doc.id } { ...doc } />
          ))}
        </div>
      :
        <span>
          { document_set.length == 0 ?
            <span>
              <br/>
              <p>Ce cours ne contient pas encore de documents...
              Tu peux en uploader toi même !</p>
            </span>
          :
            <span>
              <br/>
              Il n'y a aucun document qui correspond à ta recherche.
            </span>
          }
        </span>
      }
    </div>
  )
}

export default CourseDocumentList;
