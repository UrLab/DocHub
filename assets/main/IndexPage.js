import React from 'react';
import { useContainer } from './store';
import { Link } from 'react-router-dom';

const intComma = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Index = () => {
  const {
    store: {
      stats: {
        documents,
        users,
        threads,
        pages
      },
      debug,
      login_url
    }
  } = useContainer();
  return (
    <div className="medium-6 small-12 columns small-centered">
      <h1>DocHub</h1>
      <p>
        Bienvenue sur DocHub, le site de partage de documents et d’entraide étudiante à l’ULB.<br/>
        DocHub vous permet de poser des questions aux autres étudiants, échanger vos notes, vos résumés, d'anciens examens et bien plus encore.
      </p>
      <p className="text-center">
        Tu n'as pas besoin de créer un compte, il suffit d'employer ton netid.<br/><br/>
        <a href={ login_url } id="login_link" className="button success expand">
          Connexion
        </a><br/>
        { debug &&
          <small>
            Developpers could also <Link to={ Urls['syslogin']() }>syslogin</Link>
          </small>
        }
      </p>
      <p>
        <i className="fi-page-copy"></i>
        {" "}DocHub, c'est actuellement plus de { intComma(documents) } documents contenant
        plus de { intComma(pages) } pages ajoutées par plus de { intComma(users) } utilisateurs.<br/>
        <i className="fi-comment"></i>
        {" "}Sur DocHub, vous pouvez poser des questions et les autres étudiants peuvent y répondre.
        { threads>=100 &&
          <span>
            Il y a déjà eu plus de { threads } questions posées.
          </span>
        }
      </p>
    </div>
  )
}

export default Index;
