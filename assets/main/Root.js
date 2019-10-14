import React from "react";
import { StoreContainer } from "./store";
import Home from "./Home.js";
import Index from "./IndexPage.js"

const Root = () => {
  const { store: {user} } = StoreContainer.useContainer();
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

export default Root;
