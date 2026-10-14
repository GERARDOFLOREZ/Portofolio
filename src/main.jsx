import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import Portfolio from './Portfolio.jsx'
import Admin from './Admin.jsx'

const isAdmin = window.location.pathname.replace(/\/$/, '') === '/admin'

createRoot(document.getElementById('root')).render(isAdmin ? <Admin /> : <Portfolio />)
