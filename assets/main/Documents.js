import React, { useState } from 'react';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import Navbar from './viewer/navbar';
import { with_fetch } from './Fetch.js';
import { useContainer } from './store';

const Loader = () => (
  <div><br/>Chargement en cours...</div>
)

const Documents = () => {
  // {% block title %}{{ document.name }}{% endblock %}

  const { store: { document } } = useContainer();

  const [ state, _setState ] = useState({
    numPages: null,
    pageNumber: 1,
    view_more: 1,
    zoomlevel: 1.2
  });

  const { pageNumber, numPages, view_more, zoomlevel } = state;

  const setState = newState => {
    _setState(Object.assign({}, state, newState));
  }

  const renderPages = Math.min(5 * view_more, numPages);

  const onDocumentLoad = x => setState({ numPages: x._pdfInfo.numPages });

  const onDocumentFail = () => (
    <div className="alert-box info radius viewer-error-message">
      On dirait que ton browser n'arrive pas à afficher ce document... <br/>
      Ce n'est pas grave, tu peux quand même le&nbsp;
      <a className="viewer-error-link small"
        href={Urls['document-original'](document.id)}>
        <i className="fi-download viewer-error-icon" />&nbsp;télécharger
      </a>.
    </div>
  )

  const viewMore = () => {
    setState({ view_more: view_more + 1 })
  }

  const zoomin = () => {
    setState({ zoomlevel: zoomlevel + 0.1 })
  }

  const zoomout = () => {
    setState({ zoomlevel: zoomlevel - 0.1 })
  }

  return (
    <div className="viewer">
      <Navbar zoomin={ zoomin }
        zoomout={ zoomout }
        docname={ document.name }
        docid={ document.id }
        course_name={ document.course.name }
        course_slug={ document.course.slug }
        original={ document.original_url }
        pdf={ document.pdf_url }
        has_perm={ document.has_perm }
        is_pdf={ document.is_pdf }
      />
      <div className="row">
        <Document
          className="viewer-document"
          file={ document.pdf_url }
          loading={ <Loader /> }
          onLoadSuccess={ onDocumentLoad }
          error={ onDocumentFail() }
        >
        { Array.from(new Array(renderPages), (el, index) => (
          <Page
            key={index + 1}
            pageNumber={ index + 1 }
            renderTextLayer={ false }
            scale={ zoomlevel }
          />
        ))}
        </Document>
      </div>
      { renderPages < numPages &&
        <button className="viewer-show-more btn" onClick={ viewMore }>
          Ce document à {numPages - renderPages} pages supplémentaires. Cliquez ici pour la suite.
        </button>
      }
    </div>
  )
}

export default with_fetch(Documents, {prefix: "/api", store_as: "document"});
