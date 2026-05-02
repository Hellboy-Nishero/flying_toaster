import { useEffect, useState } from 'react'
import './components/Toaster/Toaster.jsx'
import Header from './components/Header/Header.jsx'
import Toaster from './components/Toaster/Toaster.jsx'
import SuperToaster from './components/SuperToaster/SuperToaster.jsx'
import History from './components/History/History.jsx'

function App() {

      const [toasterType, setToasterType] = useState("basic");
      const [modalActive, setModalActive] = useState(false);


  return (
    <div className='main-container'>
      <Header toasterType={toasterType} setToasterType={setToasterType} setModalActive={setModalActive}/>
      <History modalActive={modalActive}  setModalActive={setModalActive}/>
      <main className="toaster-container">
        {toasterType === "basic" ? <Toaster shown={true} /> : <SuperToaster shown={true} />}
      </main>
    </div>
  )
}

export default App
