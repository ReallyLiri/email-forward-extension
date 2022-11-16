import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Options from "./pages/Options";

const rootElement = document.getElementById('root') as HTMLElement;

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Options/>
  </React.StrictMode>
);
