import React, { useState, useEffect, useRef } from 'react';
import select2 from 'select2';
import { with_fetch } from './Fetch.js';
import { useContainer } from './store';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

require("select2/dist/css/select2.min.css");

const DocumentEdit = () => {
  // {% block title %}Ré-uploader {{document.name}}{% endblock %}

  const { store: { document } } = useContainer();
  const [ errors, setErrors ] = useState([]);
  const fileRef = useRef(null);
  const [ isSuccess, setIsSuccess ] = useState(false);

  const onChange = setter => e => {
    e.preventDefault();
    setter(e.target.value);
  }

  useEffect(() => {
    $(".chosen-select").select2({placeholder: "Tags"})
  }, [])

  const reuploadDocument = e => {
    e.preventDefault();
    const data = new FormData();
    data.append('file', fileRef.current.files[0]);
    axios.post(Urls.document_reupload(document.id), data, {
      headers: { 'content-type': 'multipart/form-data' }
    })
    .then(res => {
      setIsSuccess(true);
    })
    .catch(err => {
      console.log(err.response.data)
      setErrors(err.response.data.errors)
    })
  }

  const isSelected = id => {
    for (var tag of document.tags) {
      if (tag.id==id) {
        return true;
      }
    }
    return false;
  }

  if (isSuccess) {
    return <Redirect to={ Urls.document_show(document.id) } />
  }

  return (
    <div className="row">
      <div className="large-7 columns">
        { window.READ_ONLY &&
          <span>
            <br/>
            <div data-alert className="alert-box warning radius">
              DocHub est en maintenance, vous ne pouvez pas uploader de documents pour l'instant.
              Cela devrait être résolu dans quelques heures, renvenez bientôt ! :)
              <a href="#" className="close">&times;</a>
            </div>
          </span>
        }
        <h1>Ré-uploader</h1>
        <h3>{ document.name }</h3>
        <form className="dropzone">
          { errors.length>0 &&
            <small className="error">
              { errors.map(({field, error}, i) => (
                <span key={i}>{field} : {error}<br/></span>
              ))}
            </small>
          }
          <div className="panel callout drop-panel">
            <br/>
            <div className="row">
              <div className="small-6 columns">
                <input type="file" ref={ fileRef } />
              </div>
              <div className="small-6 columns" />
            </div>
          </div>
          <p className="text-right">
            <input type="submit"
              onClick={ reuploadDocument }
              className={
                "button success radius "+(window.READ_ONLY && "disabled")
              }
              value="Editer" />
          </p>
        </form>
      </div>
    </div>
  )
}

const formatEndpoint = args => {
  return "/api"+Urls.document_show(...args);
}

export default with_fetch(DocumentEdit, [
  { format: [formatEndpoint, ["id"]], store_as: 'document' },
]);
