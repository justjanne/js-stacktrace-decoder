import React from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';
import App from './App';
import {SourceMapConsumer} from "source-map";

// @ts-ignore
SourceMapConsumer.initialize({
  "lib/mappings.wasm": "/lib/mappings.wasm",
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
