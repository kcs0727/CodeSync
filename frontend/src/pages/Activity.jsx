import React, { useEffect, useState } from 'react'
import { AuthData } from '../context/Authcontext';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';

const Activity = () => {

  const {user} = AuthData();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [rooms, setRooms] = useState([]);


  useEffect(() => {
    if (!user) return;

    const fetchUserAndRooms = async () => {
      try {
        //fetchuser
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return;
        const data = userSnap.data();
        setUserData(data);
        const roomIds = data.roomsJoined || [];

        //fetch all rooms of user
        const roomDocs = await Promise.all(
          roomIds.map(async (id) => {
            const roomRef = doc(db, "rooms", id);
            const roomSnap = await getDoc(roomRef);

            if (!roomSnap.exists()) return null;
            const r = roomSnap.data();

            //fetch room creator name using userID
            let creatorName = "Unknown";
            if (r.createdBy) {
              const cRef = doc(db, "users", r.createdBy);
              const cSnap = await getDoc(cRef);
              if (cSnap.exists()) creatorName = cSnap.data().name || creatorName;
            }

            return { id, creatorName, ...r };
          })
        );

        //sorting by updatetime
        const allRooms = roomDocs.filter(Boolean);
        allRooms.sort((a, b) => {
          const d1 = a.lastUpdatedAt?.toDate() || new Date(0);
          const d2 = b.lastUpdatedAt?.toDate() || new Date(0);
          return d2 - d1;
        });

        setRooms(allRooms);
      }
      catch (err) {
        toast.error("Error loading activity");
        console.error(err);
      }
    }

    fetchUserAndRooms();

  }, [user])

  const formatDate = (dateLike) => {
    if (!dateLike) return "Unknown";
    const d = typeof dateLike.toDate === "function" ? dateLike.toDate() : new Date(dateLike);
    return d.toLocaleString();
  };


  return (
    <div className='flex flex-col items-center h-[calc(100vh-70px)] p-2'>

      {/* user card */}
      <div className="w-lg max-w-[95vw]  border-2 border-gray-600 rounded-xl p-4 flex items-center gap-5 md:gap-10 my-3 bg-[#15161f]">

        <img key={userData?.photo || user?.photoURL} src={userData?.photo || user?.photoURL || "https://ui-avatars.com/api/?name=User"}
          alt="avatar" className="size-25 rounded-full object-cover border border-gray-700" />

        <div className="flex flex-col gap-2">
          <div className="font-semibold">Name: {userData?.name || user?.displayName || "Unknown User"}</div>
          <div className="text-sm text-gray-200">Email: {userData?.email || user?.email || "no-email@example.com"}</div>
          <div className="text-sm text-gray-400">User from: {formatDate(userData.createdAt)}</div>
        </div>

      </div>

      {/* room list */}
      <div className="w-full max-w-[95vw] flex flex-col gap-2 mt-4">

        {rooms.length === 0 && (
          <div className="text-gray-200 text-center mt-10">
            No rooms found.
          </div>
        )}

        {rooms.map((room) => (
          <div key={room.id} onClick={() => navigate(`/projectdetails/${room.id}`)} className="cursor-pointer p-4 bg-[#15161f] hover:bg-[#1a1c23] border border-[#4aed88]/20 rounded-lg flex justify-between transition">

            <div className='flex flex-col justify-between'>
              <div className='font-semibold text-lg'>{room.roomName || "Untitled Room"}</div>
              <div className='text-sm text-gray-300'>{room.description || "No description provided."}</div>
            </div>

            {/* Right side */}
            <div className='text-right text-sm flex flex-col justify-between'>
              <div className='text-gray-300'>Created by: {room.creatorName || "unknown"}</div>
              <div className='text-gray-400 text-xs'>Last updated: {formatDate(room.updatedAt)}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}

export default Activity