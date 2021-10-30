import React from 'react';
import ReactDOM from 'react-dom';
import { Root } from './Root';

const applicationRoot = document.createElement('div');
document.body.appendChild(applicationRoot);

if (!applicationRoot) {
  throw new Error('Could not find #application-root');
}

ReactDOM.render(
  React.createElement(Root),
  applicationRoot,
);
