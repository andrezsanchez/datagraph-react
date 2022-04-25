import React from 'react';
import { App } from './App';

export class Root extends React.Component {
  render() {
    return (
      <div>
        <h1>To do:</h1>
        <div>
          <App />
        </div>
      </div>
    );
  }
}
