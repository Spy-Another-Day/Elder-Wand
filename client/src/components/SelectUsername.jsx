import { useState } from "react";

const SelectUsername = ({ onInput }) => {
  const [username, setUsername] = useState("");

  const isValid = username.length > 2;

  const onSubmit = (event) => {
    event.preventDefault();
    if (isValid) {
      onInput(username);
    }
  };

  return (
    <div className="select-username">
      <form onSubmit={onSubmit}>
        <input
          className=""
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your username..."
        />
        <button disabled={!isValid}>Send</button>
      </form>
    </div>
  );
};

export default SelectUsername;
