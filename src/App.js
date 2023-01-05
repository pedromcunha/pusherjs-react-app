import "./App.css";

import Pusher from "pusher-js";
import { useEffect, useState } from "react";
const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
  cluster: process.env.REACT_APP_PUSHER_CLUSTER,
  wsHost: process.env.REACT_APP_WS_HOST,
  forceTLS: true,
  disableStats: true,
  enabledTransports: ["ws", "wss"],
});

Pusher.logToConsole = true;

const channel = pusher.subscribe(process.env.REACT_APP_PUSHER_CHANNEL);
channel.bind_global(function (event, data) {
  console.log("NEW EVENT: ", event);
  console.log(data);
});

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    channel.bind_global(function (event, data) {
      console.log("NEW EVENT: ", event);
      console.log(data);
      setMessages((messages) => {
        setMessages([...messages, { event, data }]);
      });
    });

    return () => {
      channel.unbind_global();
    };
  }, []);

  return (
    <div className="App">
      {messages.forEach((message, i) => {
        <div key={i}>{JSON.stringify(message)}</div>;
      })}
    </div>
  );
}

export default App;
