import {useState, useContext, useEffect} from 'react';
import { SocketContext } from '../socket.js';

const Chat = () => {

  const [messages, setMessages] = useState([])

  const socket = useContext(SocketContext)

  var clientId;

  useEffect(()=>{

    const handleMessages = (msg) => {
      console.log(msg)
      setMessages(prevMessages => [...prevMessages, msg])
    }

    const handleId =  (data) => {
      clientId = data.socketId;
      console.log('test')
    }

    socket.on('id', handleId)

    socket.on('message', handleMessages)

    return () => {
      socket.off('message', handleMessages)
      // socket.off('id', handleId)  <-- This prevents it from creating two event listeners and console logging twice, however I lose track of the userId as well... will need to find a fix
    }

  }, [socket])

  const handleBtnPress = (e) => {
    e.preventDefault();
    var input = document.getElementById('chat-input')
    if (input.value) {
      var messageInfo = {
        clientId: socket.id,
        message: input.value
      }
      socket.emit('sendmessage', messageInfo);
      input.value = "";
      console.log(clientId)
    }
  }

  return (
    <div style={{border: "1px solid black"}}>
      <ul id="chat">
        {messages.map((msg, index) => (
          <div key={index}>{msg.clientId}: {msg.message}</div>
        ))}
      </ul>
      <input id="chat-input" type="text" ></input>
      <button onClick={handleBtnPress}>submit</button>
    </div>
  )
}

export default Chat;