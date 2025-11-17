import React from 'react'
import { NavLink } from 'react-router-dom'
import codesync from '../assets/code-sync.png'

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-[70px] w-full px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between bg-linear-to-r from-indigo-800 to-[#35b064] transition-all">

            <img src={codesync} alt="codesync" className='h-[50px]'/>

            <ul className="text-white flex items-center gap-10">
                <li><NavLink className="hover:text-white/70 transition" to="/">Home</NavLink></li>
                <li><NavLink className="hover:text-white/70 transition" to="/activity" >Activity</NavLink></li>
                <li><NavLink className="hover:text-white/70 transition" to="/collaboration" >Collaboration</NavLink></li>
            </ul>

            <button type="button" className="bg-white text-gray-700 inline text-sm hover:opacity-90 active:scale-95 transition-all w-40 h-11 rounded-full cursor-pointer">
                Get started
            </button>

        </nav>
    )
}

export default Navbar