import React, { useState } from 'react'
import Avatar from 'react-avatar';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({clients, roomId}) => {

    const navigate= useNavigate();

    const copyRoomId= async()=>{
        try{
            await navigator.clipboard.writeText(roomId);
            toast.success("Room Id copied");
        }
        catch (err){
            toast.error("could not copy Room Id");
            console.log(err);
        }
    }

    const leaveRoom= ()=>{
        navigate("/");
    }


    return (
        <div className='flex flex-col justify-between w-[230px] h-full rounded-md bg-[#15161f] p-2'>

            <div className='flex flex-col gap-3'>
                <h3 className='font-bold py-1 border-b-2 border-[#52545f]'>Connected users..</h3>

                <div className='flex flex-wrap gap-3 h-full'>{
                    clients.map((client) => (
                        <div className='flex flex-col' key={client.socketId} >
                            <Avatar name={client.username} size={50} round='14px' />
                            <span className='text-[12px] text-center'>{client.username}</span>
                        </div>
                    ))
                }</div>
            </div>

            <div className='flex flex-col gap-3 text-black font-semibold'>
                <button className='bg-[#4aed88]/90 p-1 rounded cursor-pointer' onClick={copyRoomId}>Copy Room Id</button>
                <button className='bg-red-400/90 p-1 rounded cursor-pointer' onClick={leaveRoom}>Leave Room </button>
            </div>
        </div>
    )
}

export default Sidebar