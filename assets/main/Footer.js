import React from "react";

const Footer = () => {
  return (
    <footer className="text-center">
      <br/>
      Made with love at
      {' '}<a href="https://urlab.be">
        <img src="/static/images/urlab.png" style={{height: "1em"}}/>
        {' '}UrLab
      </a>
      {' '}- Code on <a href="https://github.com/UrLab/beta402">GitHub</a>
      {' '}- <a href="https://cerkinfo.be">
          <img style={{height: "1.0em"}} src="/static/images/ci.png"/>
        </a>
      - <a href="/api/">API</a>
      <br/><br/>
    </footer>
  )
}

export default Footer;
