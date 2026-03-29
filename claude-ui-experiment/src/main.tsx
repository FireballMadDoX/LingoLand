import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import DevRoot from '../DevRoot'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DevRoot />
  </StrictMode>,
)
