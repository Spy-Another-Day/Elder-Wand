import { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom"
import { SocketContext } from '../socket.js'
import uuid4 from 'uuid4';


const LandingPage = () => {
  const socket = useContext(SocketContext);

  const [roomID, setRoomID] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [inputError, setInputError] = useState({state: false, message: ""});
  const [shareLink, setShareLink] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (redirect) {
      navigate(`/room/${roomID}`)
    }
  }, [redirect])

  const handleChangeID = (e) => {
    setRoomID(e.target.value);
  }

  const handleCreateRoom = () => {
    const roomId = uuid4();
    socket.room = roomId;
    socket.connect();
    setRoomID(roomId);
    // setRedirect(true);
    setShareLink(true);
  }

  const handleEnterRoom = () => {
    setRedirect(true);
 }

  const handleJoinRoom = () => {
    if (roomID.length < 1) {
      setInputError({state:true, message: "Enter a room id or URL to continue."});
    } else if (roomID.includes('http')) {
        const id = roomID.split('/room/')[1];
        if (uuid4.valid(id)) {
          setRoomID(id);
          setRedirect(true);
      } else {
        setInputError({state:true, message: "Invalid URL. Please verify your URL."});
      }
    } else {
      if (uuid4.valid(roomID)) {
        setRoomID(roomID);
        setRedirect(true);
      } else {
        setInputError({state:true, message: "Invalid room id. Please verify the room id."});
      }

    }
  }

  return (
    <div className=" container h-auto max-w-6xl mx-auto mt-[15%] px-8">

      <div className="relative block md:flex items-center space-x-4">

      {shareLink || (
          <div className="w-full bg-primary md:w-1/2 relative rounded-3xl shadow-lg overflow-hidden py-14">
            <button className="btn btn-neutral" onClick={handleCreateRoom}>Create a new Room</button>
          </div>
        )}


        {shareLink && (
          <div className="w-full bg-primary md:w-1/2 relative rounded-3xl shadow-lg overflow-hidden py-5 space-y-2">

            <div className="text-secondary">Room created. Share the link to your friends!</div>
            <input onChange={handleChangeID} value={`${window.location.href}room/${roomID}`}
              type="text" placeholder="Enter URL or Room ID" className="rounded-lg m-auto px-4 py-2 w-5/6" />
            <button className="btn btn-neutral" onClick={handleEnterRoom}>Enter Room</button>
          </div>
        )}

        <div className="flex bg-neutral flex-col w-full md:w-1/2 relative rounded-3xl shadow-lg overflow-hidden 
        space-y-4 py-8 px-4">

          <input onChange={handleChangeID}
            type="text" placeholder="Enter URL or Room ID" className="rounded m-auto px-4 py-2 w-full" />

          {inputError.state && (
            <div className="badge badge-error gap-2 m-auto">
              <svg className="w-4 h-4 stroke-current hover:border"
                onClick={() => setInputError(false)}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12">
                </path>
              </svg>
              {inputError.message}
            </div>
          )}

          <button className="btn btn-base-100" onClick={handleJoinRoom}>Join a Room</button>
        </div>

      </div>
    </div>
  )
}

export default LandingPage;