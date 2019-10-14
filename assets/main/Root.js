import React from "react";
import { StoreContainer } from "./store";
import Home from "./Home.js";
import Index from "./IndexPage.js"

const Root = () => {
  const { user: {is_authenticated} } = StoreContainer.useContainer();
  console.log(is_authenticated)
  return (
    <div>
      { is_authenticated ?
        <Home />
      :
        <Index />
      }
    </div>
  )
}

export default Root;
