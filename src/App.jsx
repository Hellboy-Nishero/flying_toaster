import { useState } from 'react'
import './components/Toaster/Toaster.jsx'
import Header from './components/Header/Header.jsx'
import Toaster from './components/Toaster/Toaster.jsx'
import SuperToaster from './components/SuperToaster/SuperToaster.jsx'

function App() {

      const [toasterType, setToasterType] = useState("basic");

  return (
    <>
    <Header toasterType={toasterType} setToasterType={setToasterType} />
    <div className="toaster-container">
      {toasterType === "basic" ? <Toaster shown={true} /> : <SuperToaster shown={true} />}
    </div>
    </>
  )
}

export default App
