import React from "react";
import { useContainer } from "./store";
import Home from "./Home.js";
import Index from "./IndexPage.js";
import { with_fetch } from './Fetch.js';

const Root = () => {
  const { store: {user} } = useContainer();
  return (
    <div>
      { user.is_authenticated ?
        <Home />
      :
        <Index />
      }
    </div>
  )
}

export default with_fetch(Root, {endpoint: "/spa/"});
