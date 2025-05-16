import React, { useState } from 'react';
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID",
};

initializeApp(firebaseConfig);
const auth = getAuth();

function Login() {
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    const actionCodeSettings = {
      url: window.location.href,
      handleCodeInApp: true,
    };
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem("emailForSignIn", email);
        alert("Login link sent!");
      })
      .catch(console.error);
  };

  React.useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.localStorage.getItem("emailForSignIn");
      signInWithEmailLink(auth, email, window.location.href)
        .then(() => alert("Signed in successfully"))
        .catch(console.error);
    }
  }, []);

  return (
    <div>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" />
      <button onClick={handleLogin}>Send Login Link</button>
    </div>
  );
}

export default Login;
