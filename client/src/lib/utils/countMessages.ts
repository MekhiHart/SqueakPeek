import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseClient } from "../supabase/client";

export async function countMessages(
  isPrivateConversation: boolean,
  conversationId: string,
  supabase: SupabaseClient = createSupabaseClient()
): Promise<{ count: number | null; error: PostgrestError | null }> {
  if (isPrivateConversation) {
    const { count, error } = await supabase
      .from("private_message")
      .select("*", { count: "exact", head: true })
      .eq("conversation_id", conversationId);

    return { count, error };
  } else {
    const { count, error } = await supabase
      .from("public_message")
      .select("*", { count: "exact", head: true })
      .eq("thread_id", conversationId);
    return { count, error };
  }
}
