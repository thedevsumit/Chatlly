import { useEffect, useState } from "react";
import { MessageSquarePlus, UserRoundPlus, Users, X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { userAuthStore } from "../store/userAuthStore";
import SidebarSkeleton from "./SidebarSkeleton";
import { useGroupChatStore } from "../store/useGroupStore";
import { useRef } from "react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const namegroup = useRef();
  const desc = useRef();
  const { groups, getGroups, selectedGroup, setSelectedGroup, createNewGroup } =
    useGroupChatStore();
  const [modalCreateGroup, setModalCreateGroup] = useState(false);

  const handleNewGroup = (e) => {
    e.preventDefault();
    console.log("h");
    const name = namegroup.current.value;
    const description = desc.current.value;
    const data = { name, description };

    console.log(data);
    createNewGroup(data);
    setModalCreateGroup(false);
  };

  const { onlineUsers } = userAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
    getGroups();
  }, [getUsers, getGroups]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>{" "}
          <MessageSquarePlus
            onClick={() => {
              setModalCreateGroup(true);
            }}
          />
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        <div className="text-xs text-zinc-400 px-5 mb-2 hidden lg:block">
          People
        </div>
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => {
              setSelectedUser(user);
              setSelectedGroup(null);
            }}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedUser?._id === user._id && !selectedGroup
                ? "bg-base-300 ring-1 ring-base-300"
                : ""
            }`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={
                  user.profilePic ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                }
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {groups.map((group) => (
          <button
            key={group._id}
            onClick={() => {
              setSelectedGroup(group);
              setSelectedUser(null);
            }}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedGroup?._id === group._id
                ? "bg-base-300 ring-1 ring-base-300"
                : ""
            }`}
          >
            <div className="relative mx-auto lg:mx-0">
              <div className="size-12 flex items-center justify-center bg-zinc-700 text-white text-lg font-bold rounded-full">
                {group.name[0].toUpperCase()}
              </div>
            </div>
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{group.name}</div>
              <div className="text-sm text-zinc-400">Group chat</div>
            </div>
          </button>
        ))}

        {onlineUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
        {modalCreateGroup && (
          <div className="fixed top-80 right-150  bg-white p-4 rounded-lg shadow-lg z-50 w-180 max-h-[400px] overflow-y-auto">
            <button
              onClick={() => setModalCreateGroup(false)}
              className="absolute top-2 right-2 text-red-500"
              title="Close modal"
            >
              <X size={20} />
            </button>
           
            <form
              onSubmit={handleNewGroup}
              className="w-full max-w-md mx-auto mt-6 p-6 bg-white rounded-2xl shadow-lg space-y-5"
            >
              <h2 className="text-2xl font-semibold text-gray-800 text-center">
                Create a New Group
              </h2>

              <div className="text-left">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Group Name
                </label>
                <input
                  type="text"
                  ref={namegroup}
                  placeholder="e.g. Study Buddies"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:outline-none  text-black"
                />
              </div>

              <div className="text-left">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Group Description
                </label>
                <input
                  type="text"
                  ref={desc}
                  placeholder="Short description"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:outline-none text-black"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 transition-colors text-white font-semibold py-2.5 rounded-lg shadow-md"
              >
                Create Group
              </button>
            </form>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
