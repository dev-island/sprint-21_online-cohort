import { useContext } from "react";
import { MessagesContext } from "../context/messagesContext";
import useCurrentUser from "./useCurrentUser";
import * as api from "../api/messages";
import { IUser } from "../types";

const useMessages = () => {
  const { currentUser, token } = useCurrentUser();
  const {
    messages,
    isLoading,
    addMessage,
    setIsLoading,
    updateMessage,
    updateMessageLikes,
    deleteMessage,
  } = useContext(MessagesContext);

  const handleLike = async (
    _id: string,
    alreadyLiked: boolean,
    likes: IUser[]
  ) => {
    if (!currentUser || !token) {
      return;
    }

    // Optimistic update -> Don't wait for the server to respond
    const newLikes = alreadyLiked
      ? likes.filter((like) => like._id !== currentUser._id)
      : [...likes, currentUser];
    console.log(newLikes);
    updateMessageLikes(_id, newLikes);

    await api.likeMessage(_id, currentUser._id, token);
    console.log("Liked!");
  };

  const handleDelete = async (_id: string) => {
    if (!currentUser || !token) {
      return;
    }

    deleteMessage(_id);
    await api.deleteMessage(_id, token);
    console.log("Deleted!");
  };

  const createMessage = async (body: string, cb?: () => void) => {
    try {
      if (!currentUser || !token) {
        return;
      }

      setIsLoading(true);
      const { data } = await api.createMessage(body, currentUser._id, token);
      if (!data) {
        throw new Error("Failed to create message");
      }
      addMessage(data);
      setIsLoading(false);
      if (cb) {
        cb();
      }
    } catch (error) {
      console.error("Failed to create message", error);
    }
    setIsLoading(false);
  };

  return {
    messages,
    isLoading,
    addMessage,
    updateMessage,
    deleteMessage,
    updateMessageLikes,
    createMessage,
    handleLike,
    handleDelete,
  };
};

export default useMessages;
