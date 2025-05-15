import { create } from "zustand"
import { toast } from "react-toastify"
import { axiosInstance } from "../lib/axios"
import { userAuthStore } from "./userAuthStore"
export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    isUsersLoading: false,
    selectedUser: null,
    isMessageLoading: false,

    subscribeToMessage: () => {
        const { selectedUser } = get()
        if (!selectedUser) return;
        const socket = userAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            if (newMessage.senderId !== selectedUser._id) return;
            set({
                messages: [...get().messages, newMessage]
            })
        })
    },
    unsubscribeToMessages: () => {
        const socket = userAuthStore.getState().socket;
        socket.off("newMessage");
    },
    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const resp = await axiosInstance.get("/message/users")
            set({ users: resp.data })
        } catch (error) {
            toast.error(error.response.data.msg)
        }
        finally {
            set({ isUsersLoading: false })
        }
    },

    getMessages: async (userId) => {
        set({ isMessageLoading: true });
        try {
            const resp = await axiosInstance.get(`/message/${userId}`)
            set({ messages: resp.data })
        } catch (error) {
            toast.error(error.response.data.msg)

        } finally {
            set({ isMessageLoading: false })
        }
    },
    setSelectedUser: (selectedUser) => {
        set({ selectedUser })
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        const currentUser = userAuthStore.getState().authUser;

       

        if (!selectedUser || !currentUser || !currentUser._id) {
            toast.error("Missing user info or selected user");
            return;
        }

        const tempId = `temp-${Date.now()}`;

        const tempMessage = {
            ...messageData,
            id: tempId,
            senderId: currentUser._id,
            senderName: currentUser.username,
            senderProfilePic: currentUser.profilePic || "",
            timestamp: new Date().toISOString(),
            formattedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: "pending"
        };

        set({ messages: [...messages, tempMessage] });

        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);

            set({
                messages: get().messages.map(msg =>
                    msg.id === tempId
                        ? {
                            ...res.data,
                            formattedTime: new Date(res.data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            status: "sent"
                        }
                        : msg
                )
            });
        } catch (error) {
            set({
                messages: get().messages.map(msg =>
                    msg.id === tempId ? { ...msg, status: "failed" } : msg
                )
            });
            toast.error(error.response?.data?.message || "Failed to send message");
        }
    }

}))
