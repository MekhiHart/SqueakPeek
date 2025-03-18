"use client";
import { MessageInput } from "./MessageInput";
import { ConversationHeader } from "./ConversationHeader";
import { ConversationBody } from "./ConversationBody";
import { useConversation } from "../../lib/store/conversation";
import { useState, useEffect, useMemo } from "react";
import { useProfile } from "../../lib/store/profile";
import { useSubscribeConversation } from "@/lib/hooks/useSubscribeConversation";
import { createSupabaseClient } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import { updatePrivateConversationIsRead } from "@/lib/utils/updatePrivateConversationIsRead";

/**
 * This is a UI container that holds all messages for a particular conversation
 * @param {string} conversationId - ID used to subscribe users to listen to incoming messages
 */
export function Conversation({
  conversationId,
  isPrivateConversation = false,
}: {
  conversationId: string;
  isPrivateConversation?: boolean;
}) {
  const { addMessage, clearConversation, setConversationType, isLoading } =
    useConversation();
  const { profile } = useProfile();
  const [numNewMessages, setNumNewMessages] = useState(0); // used for rendering new message notification
  const [pageNotFound, setNotFound] = useState(false);
  const supabase = useMemo(() => createSupabaseClient(), []);

  // Resets numNewMessages to 0
  function resetNumNewMessages() {
    setNumNewMessages(0);
  }

  // determines if conversation exists
  useEffect(() => {
    const doesConversationExist = async () => {
      if (isPrivateConversation) {
        const { data, error } = await supabase
          .from("private_conversation")
          .select("conversation_id")
          .eq("conversation_id", conversationId)
          .single();
        if (data && profile) {
          const { error: updateError } = await updatePrivateConversationIsRead(
            data.conversation_id,
            profile.profile_id,
            supabase
          );
          console.log("updateError: ", updateError);
        }
        return { data, error };
      } else {
        const { data, error } = await supabase
          .from("company_thread")
          .select("thread_id")
          .eq("thread_id", conversationId)
          .single();
        return { data, error };
      }
    };
    doesConversationExist().then((res) => {
      const { data, error } = res;
      if (error || !data) {
        // TODO navigate to not found page
        setNotFound(true);
      }
    });
  }, [profile, supabase, conversationId, isPrivateConversation]);

  // routes to not-found if conversation does not exist
  useEffect(() => {
    if (pageNotFound) {
      notFound();
    }
  }, [pageNotFound]);

  useSubscribeConversation(
    supabase,
    conversationId,
    addMessage,
    profile,
    setNumNewMessages
  );

  useEffect(() => {
    setConversationType(isPrivateConversation);
  }, [setConversationType, isPrivateConversation]);

  useEffect(() => {
    clearConversation();
    return () => {
      clearConversation();
    };
  }, [clearConversation, conversationId]);

  return (
    <div
      style={{
        height: "calc(100vh - 80px)", // full viewport - height of nav bar
        backgroundColor: "white",
        display: "grid",
        gridTemplateRows: "10% 80% 10%",
      }}
    >
      {/* Header */}
      <ConversationHeader conversationId={conversationId} />

      {/* Messages */}
      <ConversationBody
        isLoading={isLoading}
        numNewMessages={numNewMessages}
        resetNumNewMessages={() => resetNumNewMessages()}
        conversationId={conversationId}
      />

      {/* Message Input */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "10px 10px",
        }}
      >
        <MessageInput isLoading={isLoading} conversationId={conversationId} />
      </div>
    </div>
  );
}
