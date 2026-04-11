import { useState } from 'react'
import './components/Toaster/Toaster.jsx'
import Toaster from './components/Toaster/Toaster.jsx'
import SuperToaster from './components/SuperToaster/SuperToaster.jsx'

function App() {

  return (
    <>
    <div className="toaster-container">
      <Toaster />
      {/* <SuperToaster /> */}
    </div>
    </>
  )
}

export default App
