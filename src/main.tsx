import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import supabase from './config/supabaseClient.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <BrowserRouter>
        {/* <div style={{ backgroundColor: "#d8d8d4" }}> */}
        <App />
        {/* </div> */}
      </BrowserRouter>
    </SessionContextProvider>
  </React.StrictMode>,
)
