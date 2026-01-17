import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from './store';
import { Provider } from 'react-redux';

// Fetching the Client ID from your .env file
const clientId = process.env.REACT_APP_CLIENTID;

if (!clientId) {
  console.error("CRITICAL: Google Client ID is missing! Make sure REACT_APP_CLIENTID is set during the build process.");
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={clientId}>
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
