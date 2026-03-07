import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AudioPlayerProvider } from "./context/AudioPlayerProvider"
import { AuthProvider } from "./context/AuthContext"
import './index.css'
import App from './App.jsx'

const GOOGLE_CLIENT_ID = "478304976982-86nja1prceu20tbcth1m9cq02ka0hno2.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <AudioPlayerProvider>
            <App />
          </AudioPlayerProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)
