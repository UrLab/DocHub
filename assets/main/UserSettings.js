import React, { useState, useRef } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import FeedEntry from './FeedEntry';
import { StoreContainer, useForceStoreUpdate } from './store';
import axios from 'axios';

const UserSettingsComp = (props) => {
  // {% block title %}Profil{% endblock %}
  const { store : { user, stream, token } } = StoreContainer.useContainer();
  const [ messages, setMessages ] = useState([]);
  const [ errors, setErrors ] = useState([]);

  const forceStoreUpdate = useForceStoreUpdate("/spa"+props.location.pathname)

  const fileInputRef = useRef(null);
  const onFormSubmit = e => {
    e.preventDefault();
    if (fileInputRef.current.files.length==0) {
      setErrors([{
        field : "profile_pic",
        error : "Aucun fichier séléctionné."
      }])
    } else {
      const data = new FormData()
      data.append('profile_pic', fileInputRef.current.files[0])
      axios.post(Urls["settings"](), data)
      .then(res => {
        setErrors([])
        setMessages(res.data.messages)
        fileInputRef.current.value=null;
      })
      .catch(err => {
        setErrors(err.response.data.errors)
      })
    }
  }

  const refreshToken = e => {
    e.preventDefault();
    axios.get(Urls["reset_token"]())
    .then(res => {
      forceStoreUpdate();
      setMessages(res.data.messages)
    })
    .catch(err => {
      console.log(err)
    })
  }

  return (
    <div>
      <div className="row">
        <div className="medium-12 columns">
          <h1>Préférences</h1>
          <h3>
            <small>Ta photo de profil n’est accessible qu’aux membres de l’ULB connectés à DocHub, le reste de ton profil est privé.</small>
          </h3>
        </div>
      </div>
      <div className="row">
        { messages.length>0 &&
          <div className="large-12 columns">
            <div data-alert className="alert-box success radius">
              { messages.map((msg, i) => (
                <span key={i}>{ msg.message }</span>
              ))}
              <a href="#" className="close">&times;</a>
            </div>
          </div>
        }
      </div>
      <div className="row">
        <div className="medium-6 columns">
          <h2><i className="fi-widget"></i> Préférences</h2>
          <form action="" method="post" encType="multipart/form-data" className="dropzone">

            Photo de profil<br/>
            <img src={ user.get_photo } className="user-photo"/>
            <div className="row collapse">
              <div className="large-12 columns">
                <label className={ errors.length>0 ? "error" : "" }>
                  <input type="file" ref={fileInputRef} />
                </label>
                { errors.length>0 &&
                  <small className="error">
                    { errors.map(({error}, i) => (
                      <span key={i}>{error}<br/></span>
                    ))}
                  </small>
                }
              </div>
            </div>
            <input type="submit"
              className="button success radius small"
              value="Changer ma photo"
              onClick={ onFormSubmit }/>
          </form>
          <p>
            <small>Ton nom ou prénom est incorrect ? Envoie-nous un <a href="mailto:p402@cerkinfo.be">mail</a>, on corrige ça tout de suite !</small>
          </p>
        </div>
        <div className="medium-6 columns">
          <h2><i className="fi-list"></i> Activité</h2>
          { stream.map(action => (
              <FeedEntry key={action.id} action={ action } />
          ))}
          { stream.length==0 &&
            <p>Vous n'avez encore effectué aucune action</p>
          }
        </div>
      </div>
      <div className="row">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js"></script>
        <div className="medium-6 columns">
          <h3><i className="fi-key"></i>Token d'accès à l'API</h3>
          <input type="text" id="foo" disabled value={ token } />

          <a href="#" data-reveal-id="myModal"><small>
              <i className="fi-info"></i>
              {" "}Exemples d'utilisation
          </small></a> -
          {" "}<a href={ Urls["reset_token"]() } onClick={ refreshToken }><small>
              <i className="fi-refresh"></i>
              {" "}Supprimer cette clé et générer une nouvelle
          </small></a>

          <div id="myModal" className="reveal-modal" data-reveal aria-labelledby="modalTitle" aria-hidden="true" role="dialog">
            <h2 id="modalTitle">Utilisation de l'API</h2>
            <p className="lead">Utilisation avec CURL</p>
            <pre>{`
      curl -X GET https://dochub.be/api/ -H 'Authorization: Token `}{ token }{`'
            `}</pre>

            <p className="lead">Ou requests</p>
            <pre>{`
      import requests
      headers = {'Authorization': 'Token `}{ token }{`'}
      response = request.get("https://dochub.be/api/", headers=headers)
      print(response.json())
            `}</pre>
            <a className="close-reveal-modal" aria-label="Close">&#215;</a>
          </div>
        </div>
      </div>
    </div>
  );
}

const UserSettings = withRouter(UserSettingsComp);
export default UserSettings;
