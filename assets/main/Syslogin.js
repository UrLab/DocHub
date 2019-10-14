import React, { useState } from 'react';
import { withRouter, Link, Redirect } from 'react-router-dom';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"

const Syslogin = withRouter(({history}) => {
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ errors, setErrors ] = useState([]);
  const [ isSubmitted, setIsSubmitted ] = useState(false);

  const onUsernameChange = e => setUsername(e.target.value);
  const onPasswordChange = e => setPassword(e.target.value);

  const onFormSubmit = e => {
    e.preventDefault()
    axios.post(Urls['syslogin'](), {
      username,
      password
    }).then(res => setIsSubmitted(true))
    .catch(err => console.log(err))
  }

  if (isSubmitted) {
    return <Redirect to="/" />
  }

  return (
    <div>
      <div className="small-12 columns small-centered">
        <div data-alert className="alert-box alert">
          <strong>Attention</strong> : Cette page ne devrait être utilisée que par les administrateurs. <br/>
          Ne rentre <strong>pas</strong> ton netid ici.<br/><br/>
          Si tu es un étudiant, connecte toi avec <Link to="/">le gros bouton</Link>
        </div>
      </div>

      <div className="columns small-centered">
        <form>
          <table>
            <tbody>
              <tr>
                <td colSpan="2">
                  { errors.length>0 &&
                    <div data-alert className="alert-box alert">
                      Nom d'utilisateur et/ou mot de passe incorrect. Veuillez ré-essayer.
                    </div>
                  }
                </td>
              </tr>
              <tr>
                <td>Nom d'utilisateur</td>
                <td>
                  <input value={ username } type="text"
                  onChange={ onUsernameChange } />
                </td>
              </tr>
              <tr>
                <td>Mot de passe</td>
                <td>
                  <input value={ password } type="password"
                  onChange={ onPasswordChange } />
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <input type="submit" value="Connexion"
                  className="button expand"
                  onClick={ onFormSubmit }/>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  )
})

export default Syslogin;
