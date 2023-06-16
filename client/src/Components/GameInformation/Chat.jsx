import {useState, useContext, useEffect, useRef} from 'react';
import { SocketContext } from '../../socket.js';
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { GameStateContext } from '../Context.js';


const Chat = () => {

  const gameState = useContext( GameStateContext)
  const [messages, setMessages] = useState([])
  const [clientId, setClientId] = useState('')
  const chatEnterRef = useRef(null);

  const outerRef = useRef(null);
  const innerRef = useRef(null);

  const params = useParams();

  const socket = useContext(SocketContext)

  useEffect(() => {
    socket.emit('getlogs', params.roomID)
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
    outerRef.current.scrollTo({
      top: innerHeight - outerHeight + 18,
      left: 0,
      behavior: "smooth"
    });


  }, [messages]);


  useEffect(()=>{

    const handleMessages = (msgArr) => {
      setMessages(msgArr)
    }

    const handleId =  (data) => {
      setClientId(data.socketId);
    }

    socket.on('id', handleId)

    socket.on('message', handleMessages)

    return () => {
      socket.off('message', handleMessages)
      socket.off('id', handleId)
    }

  }, [socket])
  const { isLoaded, isSignedIn, user } = useUser();

  const handleBtnPress = (e) => {
    e.preventDefault();
    let username = user.username;
    let input = document.getElementById('chat-input')
    if (input.value) {
      let messageInfo = {
        clientId: socket.id,
        message: input.value,
        roomId: params.roomID,
				"user": username
      }
      socket.emit('sendMessage', messageInfo);
      input.value = "";
      window.scrollTo(0, document.body.scrollHeight);
    }
  }

  const chatInputOnKeyDown =(e)=> {
    if(e.key === 'Enter') {
      e.preventDefault();
      chatEnterRef.current.click();
    }
  }

  if (isLoaded && isSignedIn) {
    return (
        <div className="w-1/5 flex-col  h-full -mt-2 z-0">
          <div className="w-12/12 flex justify-center my-3 min-h-full max-h-[45vh]">
            <div id="chat" ref={outerRef} className="bg-secondary min-w-full rounded-md pb-1 overflow-y-scroll">
              <ul ref={innerRef}>
                {messages.map((msg, index) => {
                  return (
                    <div className="w-12/12 p-1 text-neutral bg-gray-50 rounded-md mt-1 ml-1 mr-1 text-left" key={index}>{msg.user}: {msg.message}</div>
                  )
                })}
              </ul>
            </div>
          </div>
            <div className=''>
              <input id="chat-input" autoComplete="off" type="text" placeholder="Enter chat" className="rounded m-auto px-4 py-2 w-12/12" onKeyDown={chatInputOnKeyDown}></input>
              <button className="btn btn-neutral ml-2" ref={chatEnterRef} onClick={handleBtnPress}>send</button>
            </div>
        </div>
    )
  } else {
    return <div>Loading...</div>
  }

}

export default Chat;