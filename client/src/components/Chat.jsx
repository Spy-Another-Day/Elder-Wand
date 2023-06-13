import {useState, useContext, useEffect} from 'react';
import { SocketContext } from '../socket.js';
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";


const Chat = () => {


  const [messages, setMessages] = useState([])
  const [username, setUsername] = useState('')
  const [clientId, setClientId] = useState('')
  const params = useParams();

  const socket = useContext(SocketContext)

  useEffect(()=>{

    const handleMessages = (msg) => {
      console.log(msg)
      setMessages(prevMessages => [...prevMessages, msg])
    }

    const handleId =  (data) => {
      setClientId(data.socketId);
    }

    const handleUsername =  (data) => {
      setUsername(data.socketId);
    }

    socket.on('username', handleUsername)

    socket.on('id', handleId)

    socket.on('message', handleMessages)

    return () => {
      socket.off('message', handleMessages)
      socket.off('id', handleId)
      socket.off('username', handleUsername)
      // socket.off('id', handleId)  <-- This prevents it from creating two event listeners and console logging twice, however I lose track of the userId as well... will need to find a fix
    }

  }, [socket])

  const handleBtnPress = (e) => {
    e.preventDefault();
    var input = document.getElementById('chat-input')
    if (input.value) {
      var messageInfo = {
        clientId: socket.id,
        username: username,
        message: input.value,
        roomId: params.roomID
      }
      socket.emit('sendmessage', messageInfo);
      input.value = "";
      console.log(clientId)
    }
  }

  const { isLoaded, isSignedIn, user } = useUser();

  if (isLoaded && isSignedIn) {
    return (
      <div className="w-12/12 flex-col">
        <div className="w-12/12 flex justify-center my-3">
          <ul id="chat" className="bg-gray-50 w-4/12 rounded-sm">
            {messages.map((msg, index) => {
              return (
                <div key={index}>ROOM {msg.roomId} --- {user.username}: {msg.message}</div>
              )
            })}
          </ul>
        </div>
          <div>
            <input id="chat-input" type="text" placeholder="Enter chat" className="rounded m-auto px-4 py-2 w-50%"></input>
            <button className="btn btn-neutral" onClick={handleBtnPress}>send</button>
          </div>
      </div>
    )
  } else {
    return <div>Loading...</div>
  }

}

export default Chat;