import React, { useState, useRef, useEffect } from 'react';
import { useContainer } from './store.js';
import { with_fetch } from './Fetch.js';
import axios from 'axios';
import select2 from 'select2';
import { Redirect, useParams } from 'react-router-dom';

require("select2/dist/css/select2.min.css");

const UploadFile = () => {
  const { slug } = useParams();

  const [ name, setName ] = useState("");
  const [ description, setDescription ] = useState("");
  const [ formTags, setTags ] = useState([]);
  const [ errors, setErrors ] = useState([]);
  const { store : { READ_ONLY, course, tags } } = useContainer();
  const singleInputRef = useRef(null);
  const multipleInputRef = useRef(null);
  const tagsRef = useRef(null);
  const [ isSuccess, setIsSuccess ] = useState(false);

  const onChange = setter => e => {
    e.preventDefault();
    setter(e.target.value);
  }

  const uploadSingle = e => {
    e.preventDefault();
    const data = new FormData()
    data.append('file', singleInputRef.current.files[0]);
    data.append('name', name);
    data.append('description', description);
    data["tags"] = Array.from(tagsRef.current.selectedOptions).map(x => x.value);
    axios.post(Urls.document_put(course.slug), data, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
    .then(res => {
      setIsSuccess(true);
    })
    .catch(err => {
      console.log(err.response.data)
      setErrors(err.response.data.errors)
    })
  }

  const uploadMultiple = e => {
    e.preventDefault();
    const data = new FormData()
    for (var file of multipleInputRef.current.files) {
      data.append('files', file);
    }
    // data.append('files', singleInputRef.current.files);
    axios.post(Urls.document_put_multiple(course.slug), data, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
    .then(res => {
      console.log("okokoko")
      setIsSuccess(true);
    })
    .catch(err => {
      console.log(err.response.data)
      setErrors(err.response.data.errors)
    })
  }

  useEffect(() => {
    $(".chosen-select").select2({placeholder: "Tags"})
  }, [])

  // {% block title %}Uploader{% endblock %}

  if (isSuccess) {
    return <Redirect to={ Urls.course_show(slug) } />
  }

  return (
    <div className="row">
      <div className="large-12 columns">
        { READ_ONLY &&
          <div>
            <br/>
            <div data-alert className="alert-box warning radius">
              DocHub est en maintenance, vous ne pouvez pas uploader de documents pour l'instant.
              Cela devrait être résolu dans quelques heures, renvenez bientôt ! :)
              <a href="#" className="close">&times;</a>
            </div>
          </div>
        }

        <h1>Uploader <small>{ course.name }</small></h1>
        <ul className="tabs" data-tab>
          <li className="tab-title active">
            <a href="#upload-tab-1" >
              <i className="fi-page-filled" /> Un seul fichier
            </a>
          </li>
          <li className="tab-title">
            <a href="#upload-tab-n">
              <i className="fi-page-multiple" /> Plusieurs fichiers
            </a>
          </li>
        </ul>
        <div className="tabs-content">
          <div className="content active" id="upload-tab-1">
            <form method="post"
              encType="multipart/form-data" className="dropzone">
              <p>Vous pouvez uploader à peu près n'importe quel type de document. DocHub accepte les pdf, jpg, png, doc(x), ppt(x), odt, et bien plus encore.</p>
              <p>Complétez une brève description du document afin d'aider tout le monde à trouver les informations plus efficacement. Vous pourrez encore les éditer plus tard s'il le faut.</p>

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
                    <input type="file" ref={ singleInputRef } />
                  </div>
                  <div className="small-6 columns" />
                </div>
              </div>

              <input value={ name }
                onChange={ onChange(setName) }
                placeholder="Titre (optionnel)" />
              <select className="chosen-select" ref={ tagsRef } multiple>
                <option value="" disabled>Tags</option>
                { tags.map(tag => (
                  <option key={ tag.id } value={ tag.id }>
                    { tag.name }
                  </option>
                ))}
              </select>
              <br/>
              <br/>
              <input value={ description }
                onChange={ onChange(setDescription) }
                placeholder="Description (optionnel)" />
              <p className="text-right">
                <br/>
                <input type="submit"
                  onClick={ uploadSingle }
                  className={"button success radius"+(READ_ONLY && " disabled")}
                  value="Upload" />
              </p>
            </form>
          </div>

          <div className="content" id="upload-tab-n">
            <form method="post"
              encType="multipart/form-data" className="dropzone">
              <p>Vous pouvez uploader à peu près n'importe quel type de document. DocHub accepte les pdf, jpg, png, doc(x), ppt(x), odt, et bien plus encore.</p>
              <p>Vous pourrez éditer la description et les tags de chaque document individuellement par après</p>

              { errors>0 &&
                <small className="error">
                  { errors.map((error, i) => (
                    <span key={i}>{error}<br/></span>
                  ))}
                </small>
              }
              <div className="panel callout drop-panel">
                <br/>
                <div className="row">
                  <div className="small-6 columns">
                    <input type="file" multiple ref={ multipleInputRef } />
                  </div>
                </div>
              </div>

              <p className="text-right">
                <input type="submit"
                  className={ "button success radius"+ (READ_ONLY && "disabled") }
                  value="Upload"
                  onClick={ uploadMultiple } />
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default with_fetch(UploadFile, [
  { prefix: '/spa' }
]);
