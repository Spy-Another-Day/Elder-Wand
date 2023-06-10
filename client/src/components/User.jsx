import React from "react";
import StatusIcon from "./StatusIcon";

const User = ({ user, selected, onSelect }) => {
  const onClick = () => {
    onSelect(user);
  };

  const status = user.connected ? "online" : "offline";

  return (
    <div className={`user p-3 ${selected ? "bg-primary" : ""}`} onClick={onClick}>
      <div className="inline-block">
        <div className="name">
          {user.username} {user.self ? " (yourself)" : ""}
        </div>
        <div className="text-slate-400">
          <StatusIcon connected={user.connected} />
          {status}
        </div>
      </div>
      {user.hasNewMessages && <div className="new-messages">!</div>}
    </div>
  );
};

export default User;
