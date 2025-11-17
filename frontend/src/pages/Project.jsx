import React, { useEffect, useRef, useState } from 'react'
import Editor from '../components/Editor';
import Sidebar from '../components/Sidebar';
import { initSocket } from '../socketio/socket';
import ACTIONS from '../socketio/actions';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';


const Project = () => {

    const socketRef = useRef(null);
    const codeRef= useRef(null);
    const navigate = useNavigate();
    const { roomId } = useParams();
    const location = useLocation();
    const user = location.state?.user;
    const [clients, setClients] = useState([]);


    useEffect(() => {
        if (socketRef.current) return;

        const init = async () => {
            socketRef.current = await initSocket();

            socketRef.current.on("connect_error", () => handleError());
            socketRef.current.on("connect_failed", () => handleError());
            function handleError() {
                toast.error("Socket connection failed");
                navigate("/collaboration");
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                newuser: user,
            });

            socketRef.current.on(ACTIONS.JOINED, ({ clients, newuser, socketId }) => {
                if (newuser !== user) {
                    toast.success(`${newuser} joined the room.`)
                }
                setClients(clients);
                socketRef.current.emit(ACTIONS.SYNC_CODE,{
                    code: codeRef.current,
                    socketId
                });
            });

            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} disconnected from the room.`)
                setClients((prev) => prev.filter((c) => c.socketId !== socketId));
            });
        }

        init();

        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        }
    }, []);
    


    return (
        <div className='h-[calc(100vh-70px)] flex gap-1 p-2'>

            <Sidebar clients={clients} roomId={roomId}/>

            <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>codeRef.current=code} />

        </div>
    )
}

export default Project