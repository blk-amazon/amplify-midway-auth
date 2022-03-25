import React from 'react';
import logo from './logo.svg';
import './App.css';

// import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import Amplify, { Auth, Hub } from "aws-amplify";
import awsExports from "./aws-exports";
// import SignIn from './components/Signin';
Amplify.configure(awsExports);
// Auth.federatedSignIn({ provider: 'AmazonFederate' })

function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          getUser().then(userData => setUser(userData));
          break;
        case 'signOut':
          setUser(null);
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.log('Sign in failure', data);
          break;
      }
    });

    getUser().then(userData => setUser(userData));
  }, []);

  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then(userData => userData)
      .catch(() => console.log('Not signed in'));
  }

  return (
    <div className="App">
      {user ? (
        <div>
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
            <button onClick={() => Auth.signOut()}>Sign Out</button>
          </header>
        </div>
      ) : (
        // <button onClick={() => Auth.federatedSignIn()}>Federated Sign In</button>
        <button onClick={() => Auth.federatedSignIn({provider: "AmazonFederate" })}>Login with AmazonFederate</button>
      )}
    </div>
  );
}

export default App;
