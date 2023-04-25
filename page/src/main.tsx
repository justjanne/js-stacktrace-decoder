import App from './App.js';
import {SourceMapConsumer} from "source-map";
import {render} from "preact";

// @ts-ignore
SourceMapConsumer.initialize({
  "lib/mappings.wasm": "/lib/mappings.wasm",
});

render(<App />, document.getElementById('root') as HTMLElement);
