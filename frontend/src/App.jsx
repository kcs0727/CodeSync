import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Project from './pages/Project'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Activity from './pages/Activity'
import Collaboration from './pages/Collaboration'


const App = () => {
  return (
    <div className='bg-[#1c1e29] min-h-screen text-white pt-[70px]'>

        <Navbar/>

        <Routes>
            <Route path='/' element={<Home/>} />

            <Route path='/activity' element={<Activity/>} />

            <Route path='/collaboration' element={<Collaboration/>} />

            <Route path='/project/:roomId' element={<Project/>} />
        </Routes>

        <Toaster/>
    </div>
  )
}

export default App