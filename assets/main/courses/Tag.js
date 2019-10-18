import React from 'react';

const Tag = ({id, name, color, onClick, active}) => {
  var style = {border: 'solid 2px ' + color}
  var cls = "radius label tag-item";
  var icon = "";
  if (active){
    cls += " active";
    style['color'] = color;
    style['backgroundColor'] = 'white';
    icon = "fi-check";
  } else {
    style['backgroundColor'] = color;
    style['color'] = 'white';
    icon = "fi-stop";
  }

  if (!onClick){
    icon = "";
  } else {
    cls += " selectionable";
  }

  return (
    <span>
      <span
        onClick={this.clicked}
        style={style}
        className={cls}>
      <i className={icon} />
      {name}
      </span>&nbsp;
    </span>
  );
}

export default Tag;
