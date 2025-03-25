import { fetchMessages } from "@/lib/utils/fetchMessages";
import { MessageCardProps } from "@/ui/message/MessageCard";
import { useEffect, useRef } from "react";
import { useConversation } from "../store/conversation";
import { createSupabaseClient } from "../supabase/client";

/**
 * Fetches messages for a particular conversation and sets the message into store
 * @param conversationId - id of the conversation
 * @param supabase - client to make supabase queries
 */
export const useFetchMessage = (
  conversationId: string,
  supabase = createSupabaseClient()
) => {
  const {
    setMessages,
    incrementFetchCount,
    clearConversation,
    setIsLoading,
    fetchCount,
    messageFetch,
  } = useConversation();
  const seenMessageIds = useRef(new Set<string>());

  useEffect(() => {
    setIsLoading(true);
    fetchMessages(
      conversationId,
      useConversation.getState().isPrivateConversation,
      useConversation.getState().fetchCount,
      messageFetch,
      supabase
    ).then((res) => {
      const { error, data } = res;

      if (error) {
        // do something on the UI
      } else {
        const mappedData: MessageCardProps[] = data.map(
          ({
            created_at,
            sender_avatar,
            sender_username,
            message,
            message_id,
            sender_id,
          }) => ({
            avatar: sender_avatar,
            sender_username,
            timestamp: created_at,
            message,
            messageId: message_id,
            sender_id: sender_id!,
          })
        );

        // TODO: Remove this duplicate check hack if you have the brainpower to implement the solution :)
        // added hack to check for duplicates
        const hasDuplicates = mappedData.some((msg) =>
          seenMessageIds.current.has(msg.messageId)
        );

        if (!hasDuplicates) {
          mappedData.forEach((msg) =>
            seenMessageIds.current.add(msg.messageId)
          );
          setMessages(mappedData);
        }

        setIsLoading(false);
      }
    });
  }, [
    supabase,
    conversationId,
    setMessages,
    incrementFetchCount,
    clearConversation,
    setIsLoading,
    fetchCount,
  ]);
};
