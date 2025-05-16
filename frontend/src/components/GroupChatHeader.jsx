import { Trash2, UserRoundMinus, UserRoundPlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGroupChatStore } from "../store/useGroupStore";
import { userAuthStore } from "../store/userAuthStore";
import { useChatStore } from "../store/useChatStore";
import { axiosInstance } from "../lib/axios";

const GroupChatHeader = () => {
  const {
    selectedGroup,
    setSelectedGroup,
    addMember,
    removeMember,
    deleteGroup,
  } = useGroupChatStore();

  const [showModal, setShowModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);

  const { users } = useChatStore();
  const addModalRef = useRef();
  const removeModalRef = useRef();

  // Fetch group members
  useEffect(() => {
    axiosInstance
      .get(`/group/fetch-members?groupId=${selectedGroup._id}`)
      .then((res) => setGroupMembers(res.data))
      .catch((err) => {
        console.error("Failed to fetch group members", err);
        setGroupMembers([]);
      });
  }, [showModal, showRemoveModal, selectedGroup._id]);

  // Auto-close modals on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showModal &&
        addModalRef.current &&
        !addModalRef.current.contains(event.target)
      ) {
        setShowModal(false);
      }
      if (
        showRemoveModal &&
        removeModalRef.current &&
        !removeModalRef.current.contains(event.target)
      ) {
        setShowRemoveModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal, showRemoveModal]);

  const memberIds = new Set(groupMembers.map((m) => m._id));
  const userInGroup = users.filter((user) => memberIds.has(user._id));
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
          <Trash2
            onClick={() => {
              const groupId = selectedGroup._id;
              deleteGroup({ groupId });
            }}
            className="cursor-pointer hover:text-red-500 transition"
          />
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
            className="btn btn-sm btn-outline"
            onClick={() => setShowRemoveModal(true)}
            title="Remove member"
          >
            <UserRoundMinus size={20} />
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

      {/* Add Member Modal */}
      {showModal && (
        <div
          ref={addModalRef}
          className="fixed top-32 left-1/2 transform -translate-x-1/2 bg-black p-4 rounded-lg shadow-lg z-50 w-80 max-h-[400px] overflow-y-auto border border-gray-600"
        >
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-2 right-2 text-red-500"
            title="Close modal"
          >
            <X size={20} />
          </button>
          <div className="mb-2 text-center font-semibold text-lg text-white">
            Select a user to add
          </div>

          {usersNotInGroup.length === 0 ? (
            <p className="text-center text-gray-500">No users found to add.</p>
          ) : (
            <ul className="text-white">
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

      {/* Remove Member Modal */}
      {showRemoveModal && (
        <div
          ref={removeModalRef}
          className="fixed top-32 left-1/2 transform -translate-x-1/2 bg-black p-4 rounded-lg shadow-lg z-50 w-80 max-h-[400px] overflow-y-auto border border-gray-600"
        >
          <button
            onClick={() => setShowRemoveModal(false)}
            className="absolute top-2 right-2 text-red-500"
            title="Close modal"
          >
            <X size={20} />
          </button>
          <div className="mb-2 text-center font-semibold text-lg text-white">
            Select a user to remove
          </div>

          {userInGroup.length === 0 ? (
            <p className="text-center text-gray-500">
              No users found to remove.
            </p>
          ) : (
            <ul className="text-white">
              {userInGroup.map((user) => (
                <li
                  key={user._id}
                  className="cursor-pointer p-2 hover:bg-[#12161e] rounded flex items-center gap-2"
                  onClick={() => {
                    removeMember({
                      groupId: selectedGroup._id,
                      memberId: user._id,
                    });
                    setShowRemoveModal(false);
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
