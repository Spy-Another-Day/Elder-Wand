import {useState, useContext, useEffect, useRef} from 'react';
import { SocketContext } from '../../socket.js';
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";


const Chat = () => {


  const [messages, setMessages] = useState([])
  const [clientId, setClientId] = useState('')
  const chatEnterRef = useRef(null);

  const outerRef = useRef(null);
  const innerRef = useRef(null);

  const params = useParams();

  const socket = useContext(SocketContext)

  useEffect(() => {
    const outerHeight = outerRef.current.clientHeight;
    const innerHeight = innerRef.current.clientHeight;

    outerRef.current.scrollTo({
      top: innerHeight - outerHeight,
      left: 0
    });
  }, []);

  useEffect(() => {
    const outerHeight = outerRef.current.clientHeight;
    const innerHeight = innerRef.current.clientHeight;

    console.log("outer height: ", outerHeight)
    console.log("inner height: ", innerHeight)

    outerRef.current.scrollTo({
      top: innerHeight - outerHeight + 18,
      left: 0,
      behavior: "smooth"
    });


  }, [messages]);


  useEffect(()=>{

    const handleMessages = (msg) => {
      // console.log(msg)
      setMessages(prevMessages => [...prevMessages, msg])
    }

    const handleId =  (data) => {
      setClientId(data.socketId);
    }

    socket.on('id', handleId)

    socket.on('message', handleMessages)

    return () => {
      socket.off('message', handleMessages)
      socket.off('id', handleId)
      // socket.off('id', handleId)  <-- This prevents it from creating two event listeners and console logging twice, however I lose track of the userId as well... will need to find a fix
    }

  }, [socket])

  const handleBtnPress = (e) => {
    e.preventDefault();
    var input = document.getElementById('chat-input')
    if (input.value) {
      var messageInfo = {
        clientId: socket.id,
        message: input.value,
        roomId: params.roomID
      }
      socket.emit('sendMessage', messageInfo);
      input.value = "";
      console.log(clientId)
      window.scrollTo(0, document.body.scrollHeight);
    }
  }

  const chatInputOnKeyDown =(e)=> {
    if(e.key === 'Enter') {
      e.preventDefault();
      chatEnterRef.current.click();
    }
  }

  const { isLoaded, isSignedIn, user } = useUser();

  if (isLoaded && isSignedIn) {
    return (
      <div className="w-1/5 flex-col h-12/12 -mt-2">
        <div className="w-12/12 flex justify-center my-3" style={{minHeight: "100%",maxHeight: "45vh"}}>
          <div id="chat" ref={outerRef} className="bg-secondary min-w-full rounded-md pb-1 overflow-y-scroll">
            <ul ref={innerRef}>
              {messages.map((msg, index) => {
                return (
                  <div className="w-12/12 p-1 bg-gray-50 rounded-md mt-1 ml-1 mr-1 text-left" key={index}>{user.username}: {msg.message}</div>
                )
              })}
            </ul>
          </div>
        </div>
          <div>
            <input id="chat-input" autocomplete="off" type="text" placeholder="Enter chat" className="rounded m-auto px-4 py-2 w-12/12" onKeyDown={chatInputOnKeyDown}></input>
            <button className="btn btn-neutral ml-2" ref={chatEnterRef} onClick={handleBtnPress}>send</button>
          </div>
      </div>
    )
  } else {
    return <div>Loading...</div>
  }

}

export default Chat;