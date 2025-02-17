import React from 'react'
import ReactDOM from 'react-dom/client'
import { CSSReset } from '@chakra-ui/react'
import './index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CSSReset />
    <App />
  </React.StrictMode>,
)
