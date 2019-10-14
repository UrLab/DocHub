import React, {useState} from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import axios from 'axios';

const URL = "/api/search/courses/";

const handleChange = course => {
  window.location.href = `/catalog/course/${sourse.slug}`;
}

const gotoCourse = (course, e) => {
  window.location.href = course.url;
}

const getCourses = input => {
  if (!input) {
    return Promise.resolve({ options: [] });
  }
  return axios.get(`${URL}?query=${input}`)
    .then(response => ({ options: response.data }));
}

const renderOption = option => {
  return (
    <span>
      <span className="course-label secondary radius label recent-blob fixed-label">
        {option.slug}
      </span>&nbsp;
      {option.name}
    </span>
  );
}

const Search = () => {
  const {value, setValue} = useState('');
  const {options, setOptions} = useState([]);

  return (
    <Select.Async
      multi={ false }
      value={ value }
      onChange={ handleChange }
      onValueClick={ gotoCourse }
      valueKey="slug"
      labelKey="name"
      loadOptions={ getCourses }
      backspaceRemoves={ true }
      optionRenderer={ renderOption }
      placeholder="Chercher un cours (exemple: info-f-101 ou Microéconomie)"
      searchPromptText="Écrivez pour rechercher"
    />
  )
}

export default Search;
