import { UserRoundPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useGroupChatStore } from "../store/useGroupStore";
import { userAuthStore } from "../store/userAuthStore";
import { useChatStore } from "../store/useChatStore";
import { axiosInstance } from "../lib/axios";

const GroupChatHeader = () => {
  const { selectedGroup, setSelectedGroup, addMember } = useGroupChatStore();
  const [showModal, setShowModal] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const { users } = useChatStore();
  useEffect(() => {
    if (showModal && selectedGroup?._id) {
      axiosInstance
        .get(`/group/fetch-members?groupId=${selectedGroup._id}`)
        .then((res) => setGroupMembers(res.data))
        .catch((err) => {
          console.error("Failed to fetch group members", err);
          setGroupMembers([]);
        });
    }
  }, [showModal, selectedGroup]);
  const [input, setInput] = useState("");

  const handleAddMember = async () => {
    if (!input.trim()) return;

    try {
      const res = await axiosInstance.get(
        `/group/find-user?query=${input.trim()}`
      );
      const userId = res.data._id;
      const groupId = selectedGroup._id;

      await addMember({ groupId, newMembers: [userId] });
      setShowModal(false);
      setInput("");
    } catch (err) {
      console.error("User not found or failed to add", err);
      alert("User not found or failed to add.");
    }
  };
  // Get IDs of existing members for easy lookup
  const memberIds = new Set(groupMembers.map((m) => m._id));

  // Filter users to only those NOT in the group
  const usersNotInGroup = users.filter((user) => !memberIds.has(user._id));

  return (
    <div className="p-2.5 border-b border-base-300 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={
                  selectedGroup.groupAvatar ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                }
                alt={selectedGroup.name}
              />
            </div>
          </div>
          <div>
            <h3 className="font-medium">{selectedGroup.name}</h3>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="btn btn-sm btn-outline"
            onClick={() => setShowModal(true)}
            title="Add member"
          >
            <UserRoundPlus size={20} />
          </button>

          <button
            className="btn btn-sm btn-error"
            onClick={() => setSelectedGroup(null)}
            title="Close chat"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed top-20 right-10 bg-black p-4 rounded-lg shadow-lg z-50 w-80 max-h-[400px] overflow-y-auto">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-2 right-2 text-red-500"
            title="Close modal"
          >
            <X size={20} />
          </button>
          <div className="mb-2 text-center font-semibold text-lg">
            Select a user to add
          </div>

          {usersNotInGroup.length === 0 ? (
            <p className="text-center text-gray-500">No users found to add.</p>
          ) : (
            <ul>
              {usersNotInGroup.map((user) => (
                <li
                  key={user._id}
                  className="cursor-pointer p-2 hover:bg-[#12161e] rounded flex items-center gap-2"
                  onClick={() => {
                    addMember({
                      groupId: selectedGroup._id,
                      newMembers: [user._id],
                    });
                    setShowModal(false);
                  }}
                >
                  <img
                    src={
                      user.profilePic ||
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                    }
                    alt={user.username}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span>{user.fullName || user.email}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupChatHeader;
