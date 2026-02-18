import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AudioPlayerProvider } from "./context/AudioPlayerProvider";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AudioPlayerProvider>
      <App />
    </AudioPlayerProvider>
  </StrictMode>,
)
