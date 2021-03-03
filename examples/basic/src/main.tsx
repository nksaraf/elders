import {setup} from 'twind/shim';
import {css} from 'twind/css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {ErrorBoundary} from 'react-error-boundary';

setup({
  preflight: (preflight) =>
    css(preflight, {
      '[data-enabled] [data-hovering]': {
        transitionDelay: '16ms',
        boxShadow: 'var(--shadow, 0 0), 0px 0px 0px 2px #80afff'
      },
      '[data-enabled] [data-uuid]': {
        transition: 'all 50ms linear, box-shadow 250ms ease-in'
      },
      '[data-enabled] [data-uuid] > *': {
        transition: 'all 50ms linear'
      },
      '[data-enabled] [data-uuid]:not([data-changing])': {
        transitionDelay: '16ms',
        boxShadow: 'var(--shadow, 0 0), 0px 0px 0px 2px #3f87ff'
      }
    })
});

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary
      fallbackRender={({error}) => {
        return (
          <pre>
            {error.name}: {error.message}
            {error.stack}
          </pre>
        );
      }}
    >
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
  document.querySelector('#root')
);
