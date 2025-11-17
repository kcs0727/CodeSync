import React, { useState } from 'react'
import {v4 as uuidV4} from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Collaboration = () => {

    const [roomID, setRoomId]= useState('');
    const [user, setUser]= useState('');
    const navigate= useNavigate();

    const createRoom= ()=>{
        const id= uuidV4();
        setRoomId(id);
        toast.success('Created new room'); 
    }

    const joinRoom= (e)=>{
        e.preventDefault();

        navigate(`/project/${roomID}`,{
            state:{user}
        })
        toast.success('succesfully joined'); 
    }

    return (
        <div className='flex items-center justify-center h-[calc(100vh-70px)] p-2'>

            <div className='bg-[#15161f] p-4 sm:p-8 rounded-lg w-md max-w-[90vw] shadow-md shadow-gray-500 border-t-2 border-gray-500/50'>

                <h2 className='text-2xl text-[#4aed88] font-bold text-center mb-6 '>Join a Coding Room</h2>

                <form onSubmit={joinRoom} className='flex flex-col justify-between gap-4'>

                    <h3 className='text-md'>Enter an invite room ID</h3>

                    <input type="text" placeholder='Room ID' value={roomID} onChange={(e)=>setRoomId(e.target.value)} required/>

                    <input type="text" placeholder='user' value={user} onChange={(e)=>setUser(e.target.value)} required/>

                    <div>
                        <button type='submit' className='w-full bg-green-500 hover:bg-green-700 text-black font-bold py-1 rounded-md my-1 cursor-pointer'>Join</button>

                        <div>If you don't have an invite then create &nbsp; <span className="text-blue-400 underline cursor-pointer" onClick={createRoom} >New Room</span>
                        </div>
                    </div>

                </form>
            </div>

        </div>
    )
}

export default Collaboration;