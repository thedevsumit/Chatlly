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
        try {
            const res = await axiosInstance.post(`/group/message`, messageData);
            set({ groupMessages: [...groupMessages, res.data] });
        } catch (err) {
            console.error("Failed to send group message", err);
        }
    },

    addIncomingGroupMessage: (message) => {
        set({ groupMessages: [...get().groupMessages, message] });
    },

    subscribeToGroupMessages: () => {
        const { selectedGroup } = get();
        const socket = userAuthStore.getState().socket;

        if (!selectedGroup || !socket) return;

        socket.on("newGroupMessage", (newMessage) => {
            if (newMessage.groupId !== selectedGroup._id) return;
            set({ groupMessages: [...get().groupMessages, newMessage] });
        });
    },


    unsubscribeFromGroupMessages: () => {
        const socket = userAuthStore.getState().socket;
        if (socket) socket.off("newGroupMessage");
    },
}));
