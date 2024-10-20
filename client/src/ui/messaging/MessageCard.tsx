import { Card, CardHeader, Typography } from "@mui/material";
import { AvatarTypes, ProfileAvatar } from "../ProfileAvatar";
import { memo, useEffect } from "react";
import { MutableRefObject } from "react";
import { useProfile } from "../../lib/store/profile";
export interface MessageCardProps {
  avatar: AvatarTypes;
  sender_username: string;
  timestamp: string;
  message: string;
  upVotes?: number;
  downVotes?: number;
  messageId: string;
  prevDate?: MutableRefObject<Date | null>;
  scrollDown?: () => void;
}

/**
 * UI that contains the metadata of a message
 * @param {AvatarTypes} avatar: Used to render a particular profile avatar
 * @param {string} sender_username: Username of the user that sent the message
 * @param {string} timestamp: Time of when  the user sent the message
 * @param {string} message: Text content of the user's message
 * @param {() => void} scrollDown: Function that scrolls the page when invoked
 */
export const MessageCard = memo(function MessageCard({
  avatar,
  sender_username,
  timestamp,
  message,
  prevDate,
  scrollDown,
}: MessageCardProps) {
  // TODO: Make CardHeader match the UI in figma file
  // TODO: Add upVotes and downVotes component
  const { profile } = useProfile();
  const messageDate = new Date(timestamp);

  // Scrolls down page when the current user sends a
  useEffect(() => {
    if (scrollDown) scrollDown();
  });

  // TODO: Decouple boolean logic and setting prevDate state
  // TODO: This needs to get tested
  function doRenderDivider(): boolean {
    // if prevDate is passed in
    if (prevDate) {
      // if prevDate.current === null or if prevDate day does not match the
      if (
        !prevDate.current ||
        (prevDate.current && prevDate.current.getDay() !== messageDate.getDay())
      ) {
        console.log("render divider");
        prevDate.current = messageDate;

        return true;
      }
    }
    return false;
  }

  const renderDateDivider = doRenderDivider();
  const messageSenderIsCurrentUser = profile?.username === sender_username;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* TODO: Clean this up to make it simpler */}
      {renderDateDivider && prevDate?.current && (
        <Typography
          sx={{
            paddingTop: "20px",
            fontWeight: "bold",
          }}
        >
          {new Intl.DateTimeFormat("en-US", { month: "long" }).format(
            prevDate.current
          ) +
            " " +
            prevDate.current.getDay() +
            ", " +
            prevDate.current.getFullYear()}
        </Typography>
      )}
      <Card
        sx={{
          boxShadow: "none",
          width: "100%",
        }}
      >
        <CardHeader
          avatar={
            <ProfileAvatar
              avatar={avatar}
              sx={{
                border: messageSenderIsCurrentUser
                  ? "3px #496FFF solid"
                  : "none",
              }}
            />
          }
          title={
            <span
              style={{
                display: "flex",
                alignItems: "end",
              }}
            >
              <Typography
                style={{
                  color: messageSenderIsCurrentUser ? "#496FFF" : "#3C435C",
                  fontWeight: "bold",
                }}
              >
                {sender_username}
              </Typography>
              {"  "}
              <Typography
                variant="caption"
                style={{
                  marginLeft: "4px",
                }}
              >
                {messageDate.toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "2-digit",
                }) +
                  " " +
                  messageDate.toLocaleTimeString("en-US")}
              </Typography>
            </span>
          }
          subheader={
            <Typography
              variant="body2"
              sx={{
                whiteSpace: "pre-wrap", // Preserves line breaks
                wordWrap: "break-word", // Wraps long words
              }}
            >
              {message}
            </Typography>
          }
          sx={{
            alignItems: "flex-start", // Ensures avatar stays at the top when the message grows
          }}
        />
      </Card>
    </div>
  );
});
