import { useNavigate } from "react-router-dom";
import { userAuthStore } from "../store/userAuthStore";
import { useChatStore } from "../store/useChatStore";

import Chat from "../components/Chat";
import GroupChat from "../components/GroupChat"; 
import NoChatSelected from "../components/NoChatSelected";
import Sidebar from "../components/Sidebar";
import { useGroupChatStore } from "../store/useGroupStore";

const HomePage = () => {
  const { logout } = userAuthStore();
  const navigate = useNavigate();
  const { selectedUser } = useChatStore();
  const { selectedGroup } = useGroupChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {selectedUser ? (
              <Chat />
            ) : selectedGroup ? (
              <GroupChat />
            ) : (
              <NoChatSelected />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
