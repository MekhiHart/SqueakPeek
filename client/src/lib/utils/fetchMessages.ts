import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";
import { createSupabaseClient } from "../supabase/client";

/**
 * Fetches messages from a company thread table or the  private message table depending on the isPrivateConversation param
 * @param conversation_id- ID of the conversation which the messages are inserted into
 * @param isPrivateConversation - Boolean value used to determine which conversation type the message is inserted into
 * @param supabase - supabase client to make supabase queries

 * @returns {data: messages, error: Postgress error} - data contains the messages from the conversation
 */

export async function fetchMessages(
  conversation_id: string,
  isPrivateConversation: boolean,
  supabase: SupabaseClient = createSupabaseClient()
) {
  const fromQeury = isPrivateConversation
    ? "private_message"
    : "public_message";

  const selectQuery = isPrivateConversation
    ? "private_conversation!inner()"
    : "company_thread!inner()";

  const eqQuery = isPrivateConversation
    ? "private_conversation.conversation_id"
    : "company_thread.thread_id";

  const res = await supabase
    .from(fromQeury)
    .select(
      `
      *,
      ${selectQuery}
    `
    )
    .eq(eqQuery, conversation_id)
    .order("created_at", { ascending: false })


  const { error } = res;
  let data;
  if (isPrivateConversation) {
    data = res.data as Database["public"]["Tables"]["private_message"]["Row"][];
  } else {
    data = res.data as Database["public"]["Tables"]["public_message"]["Row"][];
  }

  if (error) {
    console.error(error);
  }

  if (data) {
    data.reverse();
  }
  return { data, error };
}

// prev logic with pagination
// export async function fetchMessages(
//   conversation_id: string,
//   isPrivateConversation: boolean,
//   fetchCount: number,
//   supabase: SupabaseClient = createSupabaseClient()
// ) {
//   // TODO Revert numFetchMessage back to 50 after pagination feature is implemented
//   const numFetchMessage = 50; // range of message fetch for a conversation
//   const fromQeury = isPrivateConversation
//     ? "private_message"
//     : "public_message";

//   const selectQuery = isPrivateConversation
//     ? "private_conversation!inner()"
//     : "company_thread!inner()";

//   const eqQuery = isPrivateConversation
//     ? "private_conversation.conversation_id"
//     : "company_thread.thread_id";

//   const res = await supabase
//     .from(fromQeury)
//     .select(
//       `
//       *,
//       ${selectQuery}
//     `
//     )
//     .eq(eqQuery, conversation_id)
//     .order("created_at", { ascending: false })
//     .range(
//       numFetchMessage * fetchCount,
//       (fetchCount + 1) * numFetchMessage - 1
//     );

//   const { error } = res;
//   let data;
//   if (isPrivateConversation) {
//     data = res.data as Database["public"]["Tables"]["private_message"]["Row"][];
//   } else {
//     data = res.data as Database["public"]["Tables"]["public_message"]["Row"][];
//   }

//   if (error) {
//     console.error(error);
//   }

//   if (data) {
//     data.reverse();
//   }
//   return { data, error };
// }
