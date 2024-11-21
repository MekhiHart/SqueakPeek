"use client";
import { useRef, memo, useEffect } from "react";
import { NewMessagesNotificationModal } from "./NewMessageNotificationModal";
import { MessageList } from "./MessageList";
import { CircularProgress } from "@mui/material";
import { MutableRefObject } from "react";
/**
 * Renders new message notifications, message list, and the message input
 * Handles the page scrolling for new messages and message input
 * @param {number} numNewMessages - The number of new messages received
 * @param {() => void} resetNumNewMessages - Resets the number of new messages when invoked
 */
export const ConversationBody = memo(function ConversationBody({
  numNewMessages,
  resetNumNewMessages,
  isLoading,
}: {
  numNewMessages: number;
  resetNumNewMessages: () => void;
  isLoading: boolean;
}) {
  // Scroll to the bottom of the element
  const scrollContainerRef = useRef<null | HTMLDivElement>(null);
  const topRef = useRef<null | HTMLDivElement>(null); // used for scrolling down the page
  const bottomRef = useRef<null | HTMLDivElement>(null); // used for scrolling down the page
  const scrollThreshold = 20; // threshold for determining on whether page scrolls down on new messages

  function isRefVisible(
    targetRef: MutableRefObject<HTMLDivElement | null>,
    containerRef: MutableRefObject<HTMLDivElement | null>
  ) {
    if (targetRef.current && containerRef.current) {
      const elementRect = targetRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      // Calculate if the element is within the visible bounds of the container
      const isVisible =
        elementRect.top >= containerRect.top &&
        elementRect.bottom <= containerRect.bottom + scrollThreshold &&
        elementRect.left >= containerRect.left &&
        elementRect.right <= containerRect.right;

      return isVisible;
    }

    return false;
  }

  // scrolls down to the latest message on page mount"
  function scrollDown(isSmooth: boolean) {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: isSmooth ? "smooth" : "instant",
      });
    }
  }

  // useEffect(() => {
  //   scrollContainerRef.current?.addEventListener("scroll", () => {
  //     console.log("yeaha");
  //   });
  // }, [scrollContainerRef.current]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress
          sx={{
            color: "#496FFF",
          }}
        />
      </div>
    );
  } else {
    return (
      <div
        style={{
          overflowY: "auto", // allows vertical scrolling on the messages
        }}
        ref={scrollContainerRef}
      >
        <NewMessagesNotificationModal
          numNewMessages={numNewMessages}
          scrollDown={() => scrollDown(true)}
          resetNumNewMessages={resetNumNewMessages}
        />
        <div
          ref={topRef}
          style={{
            height: `${scrollThreshold}px`,
          }}
        />
        <MessageList
          isPageBottomFlushed={isRefVisible(bottomRef, scrollContainerRef)}
          scrollDown={scrollDown}
        />

        {/* Used as a reference to scroll down the page */}
        <div
          ref={bottomRef}
          style={{
            height: `${scrollThreshold}px`,
          }}
        />
      </div>
    );
  }
});
