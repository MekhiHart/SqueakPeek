import { create } from "zustand";
import { MessageCardProps } from "@/ui/message/MessageCard";

// state of the hook
interface MessageState {
  messageTotal: number;
  messages: MessageCardProps[];
  isPrivateConversation: boolean;
  isLoading: boolean;
  doesConversationExist: boolean;
  fetchCount: number;
  addMessage: (newMessage: MessageCardProps) => void;
  clearConversation: () => void;
  setConversationType: (conversationType: boolean) => void;
  setMessages: (newMessages: MessageCardProps[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setMessageTotal: (totalCount: number) => void;
  setDoesConversationExists: (doesConversationExist: boolean) => void;
  appendFetchCount: () => void;
}

// hook that will be access in UI components
export const useConversation = create<MessageState>()((set) => ({
  messageTotal: 0,
  messages: [],
  isPrivateConversation: false,
  isLoading: false,
  doesConversationExist: false,
  fetchCount: 0,
  addMessage: (newMessage) =>
    set((state) => ({ messages: [...state.messages, newMessage] })),
  clearConversation: () => set(() => ({ messages: [], fetchCount: 0 })),
  setConversationType: (conversationType) => {
    set((state) => ({ ...state, isPrivateConversation: conversationType }));
  },
  setMessages: (newMessages) => {
    set((state) => ({ messages: newMessages.concat(state.messages) }));
  },
  setIsLoading: (isLoading) => set(() => ({ isLoading })),
  setMessageTotal: (messageTotal) => {
    set(() => ({ messageTotal }));
  },
  setDoesConversationExists: (doesConversationExist) =>
    set(() => ({ doesConversationExist })),

  appendFetchCount: () =>
    set((prevState) => ({ fetchCount: prevState.fetchCount + 1 })),
}));
