import React from 'react';

const Welcome = () => {
  return (
    <span>
      <br/>
      <div className="row">
      <div className="large-12 columns">
        <div className="panel">
          <div className="row">
            <div className="small-11 columns">
              <h3>DocHub a maintenant tous les documents de Respublicae !</h3>
            </div>
            <div className="small-1 columns text-right">
              <a href={ Urls["hide_new_panel"]() }><i className="fi-x"></i></a>
            </div>
          </div>
          <div className="row">
            <div className="large-12 columns" id="firstStop">
              <p>
                Bienvenue sur DocHub, le site de partage de documents et d’entraide étudiante à l’ULB.<br/>
                DocHub te permet de poser des questions aux autres étudiants, échanger tes notes et bien plus encore.
              </p>
              <p>
                  DocHub vient d'importer tous les documents de Respublicae, mais ils ne sont pas encore tous triés.<br/>
                  Tu ne verras donc peut-être pas le cours qui t'intéresse dans le menu des
                  cours mais tu peux faire une recherche juste au-dessus et tu devrais trouver ton bonheur !
              </p>
              <p>
                  Comme sur Respublicae, tu peux uploader des docments,
                  mais en plus de ça, tu peux t'abonner aux cours et tu verras les nouveaux uploads
                  apparaitre dans ton fil d'actualité. DocHub te permet aussi de voir en
                  direct le document dans ton navigateur sans devoir le télécharger.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>



      <ol className="joyride-list" data-joyride>
        <li data-id="joy-abonner" data-text="Suivant" data-options="prev_button: false">
          <p>Vous pouvez vous abonner à des cours. Ceux-ci apparaitront dans le menu ci-dessous.</p>
        </li>
        <li data-id="notifications-button" data-text="Suivant" data-options="tip_location:top; prev_button: false">
          <p>Vous recevrez des notifications pour les cours que vous suivez.</p>
        </li>
        <li data-id="joy-flux" data-text="Suivant" data-options="tip_location:top; prev_button: false">
          <p>Vous pouvez aussi suivre l'actualité dans le flux qui apparaitra ici.</p>
        </li>
        <li data-button="Fermer" data-options="tip_location:top; prev_button: false">
          <h4>Bienvenue sur DocHub !</h4>
          <p>DocHub vous souhaite une belle réussite !</p>
        </li>
      </ol>
    </span>
  )
}

export default Welcome;
