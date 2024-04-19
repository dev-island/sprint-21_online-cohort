import { useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { IMessage, Notification } from "../types";

type SocketProps = {
  addMessage: (message: IMessage) => void;
  addNotification: (notification: Notification) => void;
};

const useSocket = ({ addMessage, addNotification }: SocketProps) => {
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    "ws://localhost:3000"
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  useEffect(() => {
    if (lastMessage !== null) {
      const { data, type } = JSON.parse(lastMessage.data);
      console.log("Message received: ", type);
      if (type === "NEW_MESSAGE") {
        addMessage(data);
      } else if (type === "NEW_NOTIFICATION") {
        console.log("New notification: ", addNotification);
        addNotification(data);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage]);

  useEffect(() => {
    console.log("WS Connection status: ", connectionStatus);
  }, [connectionStatus]);

  return {
    sendMessage,
    connectionStatus,
  };
};

export default useSocket;
