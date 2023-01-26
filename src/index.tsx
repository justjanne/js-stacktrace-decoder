import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import sourceMap from "source-map";

// @ts-ignore
sourceMap.SourceMapConsumer.initialize({
    "lib/mappings.wasm": "https://unpkg.com/source-map@0.7.3/lib/mappings.wasm",
});
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
