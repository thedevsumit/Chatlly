import React, { useEffect, useRef } from "react";
import { useGroupChatStore } from "../store/useGroupStore";
import { userAuthStore } from "../store/userAuthStore";
import GroupChatHeader from "./GroupChatHeader";
import ChatSkeleton from "./ChatSkeleton";
import GroupMessageInput from "./GroupMessageInput";
import { formatMessageTime } from "../lib/utils";
import { useChatStore } from "../store/useChatStore";

const GroupChat = () => {
  const {
    groupMessages,
    getGroupMessages,
    isGroupMessageLoading,
    selectedGroup,
    subscribeToGroupMessages,
    unsubscribeFromGroupMessages,
  } = useGroupChatStore();
  const {users} = useChatStore();
  let members = users;
  useEffect(() => {
    if (!selectedGroup?._id) return;

    getGroupMessages(selectedGroup._id);
    subscribeToGroupMessages();

    return () => {
      unsubscribeFromGroupMessages();
    };
  }, [selectedGroup?._id]);

  const { authUser } = userAuthStore();
  const messageEndRef = useRef(null);

 

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [groupMessages]);

  if (isGroupMessageLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <GroupChatHeader />
        <ChatSkeleton />
        <GroupMessageInput />
      </div>
    );
  }

  function getSenderName(senderId, members) {
    if (!senderId || !members) return "User";

    const sender = members.find((member) => member._id === senderId);
    return sender ? sender.fullName || sender.username || "You" : "You";
  }
  console.log(members)
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <GroupChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {groupMessages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                      : message.senderProfilePic ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            <div className="chat-header mb-1">
              <span className="font-semibold text-sm">
                {getSenderName(message.senderId, members)}
              </span>
              <time className="text-xs opacity-50 ml-2">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <GroupMessageInput />
    </div>
  );
};

export default GroupChat;
