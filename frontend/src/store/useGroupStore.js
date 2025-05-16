import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { userAuthStore } from './userAuthStore';
import { toast } from 'react-toastify';

export const useGroupChatStore = create((set, get) => ({
    selectedGroup: null,
    groupMessages: [],
    isGroupMessageLoading: false,
    groups: [],

    setSelectedGroup: (group) => set({ selectedGroup: group }),
    createNewGroup: async (data) => {
        try {
            const resp = await axiosInstance.post("/group/create", data)
            toast.success("Succesfully Created New Group")
            console.log(resp.data)
            const { getGroups } = get();
            getGroups();
        } catch (error) {
            console.log(error)
        }
    },
    getGroups: async () => {
        try {
            const res = await axiosInstance.get(`/group/user-group`);
            set({ groups: res.data });
        } catch (err) {
            set({ groups: [] });
        }
    },
    addMember: async (data) => {
        try {
            const { selectedGroup } = get()
            const authUser = userAuthStore.getState().authUser;
            let admin = selectedGroup.admin

            if (authUser._id !== admin) {
                toast.error("Must be a admin of that group")
                return;
            }
            const resp = await axiosInstance.put("/group/add-member", data);
            console.log(resp.data)
            toast.success("Succesfully added the member")
        } catch (error) {
            toast.error("Error")
            console.log(error.message, error)
        }
    },
    removeMember: async (data) => {
        try {
            const { selectedGroup } = get()

            const authUser = userAuthStore.getState().authUser;
            let admin = selectedGroup.admin

            if (authUser._id !== admin) {
                toast.error("Must be a admin of that group")
                return;
            }
            const resp = await axiosInstance.put("/group/remove-member", data);
            console.log(resp.data)
            toast.success("Succesfully removed the member")
        } catch (error) {
            toast.error("Error")
            console.log(error.message, error)
        }
    },
    deleteGroup: async (data) => {
        try {
            const resp = await axiosInstance.put("/group/delete", data);
            toast.success("Deleted the group");
            set({ selectedGroup: null })
            const { getGroups } = get();
            getGroups();
        } catch (error) {
            toast.error("Error deleting the group");
            console.error(error?.response?.data?.msg || error.message, error);
        }
    },

    getGroupMessages: async (groupId) => {
        set({ isGroupMessageLoading: true });
        try {
            const res = await axiosInstance.post(`/group/messages`, { groupId });
            set({ groupMessages: res.data, isGroupMessageLoading: false });
        } catch (err) {
            set({ groupMessages: [], isGroupMessageLoading: false });
        }
    },

    sendGroupMessage: async (messageData) => {
        const { selectedGroup, groupMessages } = get();
        const currentUser = userAuthStore.getState().authUser;

        try {
            const tempId = `temp-${Date.now()}`;

            const tempMessage = {
                ...messageData,
                _id: tempId,
                senderId: currentUser._id,
                senderName: currentUser.username,
                senderProfilePic: currentUser.profilePic || "",
                createdAt: new Date().toISOString(),
                status: "pending",
            };


            set({ groupMessages: [...groupMessages, tempMessage] });


            const res = await axiosInstance.post(`/group/message`, messageData);


            set({
                groupMessages: [
                    ...groupMessages,
                    ...newMessages.filter(
                        (newMsg) => !groupMessages.some((msg) => msg._id === newMsg._id)
                    )
                ]
            });


        } catch (err) {
            console.error("Failed to send group message", err);
        }
    },




    subscribeToGroupMessages: () => {
        const { selectedGroup } = get();
        const socket = userAuthStore.getState().socket;

        if (!selectedGroup || !socket) return;

        socket.off("newGroupMessage");
        socket.on("newGroupMessage", (newMessage) => {
            set((state) => {
                
                const alreadyExists = state.groupMessages.some(
                    (msg) =>
                        msg._id === newMessage._id || // Already added by socket
                        (msg.status === "pending" &&
                            msg.senderId === newMessage.senderId &&
                            msg.text === newMessage.text &&
                            msg.image === newMessage.image)
                );

                if (!alreadyExists) {
                    return {
                        groupMessages: [...state.groupMessages, { ...newMessage, status: "sent" }],
                    };
                }

                return state; 
            });
        });


    },


    unsubscribeFromGroupMessages: () => {
        const socket = userAuthStore.getState().socket;
        if (socket) socket.off("newGroupMessage");
    },
}));
