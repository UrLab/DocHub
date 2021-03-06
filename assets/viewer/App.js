import React, { Component } from 'react';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import Navbar from './navbar';

class Loader extends Component {
    render () {
        return (<div className=""><br/>Chargement en cours...</div>)
    }
}

export default class App extends Component {
  state = {
    numPages: null,
    pageNumber: 1,
    view_more: 1,
    zoomlevel: 1.2
  }

  onDocumentLoad = ({ numPages }) => {
    this.setState({ numPages });
  }

  onDocumentFail() {
    return (
    <div className="alert-box info radius viewer-error-message">
        On dirait que ton browser n'arrive pas à afficher ce document... <br/>
        Ce n'est pas grave, tu peux quand même le&nbsp;
        <a className="viewer-error-link small" href={window.Urls['document-original'](document.getElementById('document_data').dataset.id)}>
            <i className="fi-download viewer-error-icon"></i>&nbsp;télécharger</a>.</div>)
  }

  view_more() {
    this.setState({view_more: this.state.view_more + 1})
  }

  zoomin(){
    this.setState({zoomlevel: this.state.zoomlevel + 0.1})
  }

  zoomout(){
    this.setState({zoomlevel: this.state.zoomlevel - 0.1})
  }

  render() {
    const { pageNumber, numPages, view_more, zoomlevel} = this.state;

    const renderPages = Math.min(5 * view_more, numPages);

    var render_not_full = ""
    if (renderPages < numPages) {
        render_not_full = (
            <button className="viewer-show-more btn" onClick={this.view_more.bind(this)}>
                Ce document à {numPages - renderPages} pages supplémentaires. Cliquez ici pour la suite.
            </button>
        );
    }

    var document_data = document.getElementById('document_data').dataset

    return (
      <div className="viewer">
        <Navbar zoomin={this.zoomin.bind(this)}
                zoomout={this.zoomout.bind(this)}
                docname={document_data.name}
                docid={document_data.id}
                course_name={document_data.coursename}
                original={document_data.original}
                pdf={document_data.pdf}
                has_perm={document_data.hasperm}
                is_pdf={document_data.ispdf}
        />
        <div className="row">
        <Document
          className="viewer-document"
          file={document_data.url}
          loading={<Loader />}
          onLoadSuccess={this.onDocumentLoad}
          error={this.onDocumentFail()}
        >
            {
            Array.from(
              new Array(renderPages),
              (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  renderTextLayer={false}
                  scale={zoomlevel}
                />

              ),
            )
            }
        </Document>
        </div>
        {render_not_full}
      </div>
    );
  }
}
