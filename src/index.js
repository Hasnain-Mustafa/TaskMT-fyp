import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import { ContextProvider } from "./contexts/ContextProvider";

import store from "./app/store";
import { Provider } from "react-redux";
import { ChatEngineWrapper } from "react-chat-engine";
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <ContextProvider>
        <ChatEngineWrapper>
          <App />
        </ChatEngineWrapper>
      </ContextProvider>
    </BrowserRouter>
  </Provider>,

  document.getElementById("root")
);
