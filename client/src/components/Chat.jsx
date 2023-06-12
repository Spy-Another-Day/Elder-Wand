import { useState, useEffect, useContext } from "react";
import { SocketContext } from '../socket.js';
import User from "./User.jsx";
import MessagePanel from "./MessagePannel.jsx";


const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const socket = useContext(SocketContext)
  const onMessage = (content) => {
    if (selectedUser) {
      socket.emit("private message", {
        content,
        to: selectedUser.userID,
      });
      setSelectedUser((prevUser) => ({
        ...prevUser,
        messages: [
          ...prevUser.messages,
          {
            content,
            fromSelf: true,
          },
        ],
      }));
    }
  };

  const onSelectUser = (user) => {
    setSelectedUser(user);
    user.hasNewMessages = false;
  };

  useEffect(() => {
    const initReactiveProperties = (user) => {
      user.connected = true;
      user.messages = [];
      user.hasNewMessages = false;
    };

    const handleConnect = () => {
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.self) {
            return {
              ...user,
              connected: true,
            };
          }
          return user;
        })
      );
    };

    const handleDisconnect = () => {
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.self) {
            return {
              ...user,
              connected: false,
            };
          }
          return user;
        })
      );
    };

    const handleUsers = socket.on("users", (users) => {
      users.forEach((user) => {
        user.messages.forEach((message) => {
          message.fromSelf = message.from === socket.userID;
        });
        for (let i = 0; i < this.users.length; i++) {
          const existingUser = this.users[i];
          if (existingUser.userID === user.userID) {
            existingUser.connected = user.connected;
            existingUser.messages = user.messages;
            return;
          }
        }
        user.self = user.userID === socket.userID;
        initReactiveProperties(user);
        this.users.push(user);
      });
      // put the current user first, and sort by username
      this.users.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
    });

    const handleUserConnected = (user) => {
      initReactiveProperties(user);
      setUsers((prevUsers) => [...prevUsers, user]);
    };

    const handleUserDisconnected = (id) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.userID === id) {
            return {
              ...user,
              connected: false,
            };
          }
          return user;
        })
      );
    };

    const handlePrivateMessage = ({ content, from }) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.userID === from) {
            const updatedUser = {
              ...user,
              messages: [
                ...user.messages,
                {
                  content,
                  fromSelf: false,
                },
              ],
            };
            if (user !== selectedUser) {
              updatedUser.hasNewMessages = true;
            }
            return updatedUser;
          }
          return user;
        })
      );
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("users", handleUsers);
    socket.on("user connected", handleUserConnected);
    socket.on("user disconnected", handleUserDisconnected);
    socket.on("private message", handlePrivateMessage);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("users", handleUsers);
      socket.off("user connected", handleUserConnected);
      socket.off("user disconnected", handleUserDisconnected);
      socket.off("private message", handlePrivateMessage);
    };
  }, [selectedUser]);

  return (
    <div>
      <div className="fixed left-0 top-0 bottom-0 w-260px overflow-x-hidden">
        {users.map((user) => (
          <User
            key={user.userID}
            user={user}
            selected={selectedUser === user}
            onSelect={onSelectUser}
          />
        ))}
      </div>
      {selectedUser && (
        <MessagePanel
          user={selectedUser}
          onInput={onMessage}
          className="ml-260px"
        />
      )}
    </div>
  );
};

export default Chat;
