import { useState } from 'react'
import { ToastContainer } from 'react-toastify';
import { Toast } from 'react-toastify/dist/components';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header/index'
import SalesCard from './components/SalesCard/index'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <ToastContainer />
      <Header />

      <main>
        <section id="sales">
          <div className="dsmeta-container">
            <SalesCard />
          </div>
        </section>
      </main>

    </>


  )
}

export default App
