"use client";
import { Typography, Tabs, Tab } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

import {
  faBuilding as solidBuilding,
  faMessage as solidMessage,
} from "@fortawesome/free-solid-svg-icons";

import {
  faBuilding as regularBuilding,
  faMessage as regularMessage,
} from "@fortawesome/free-regular-svg-icons";

import { usePathname } from "next/navigation";
import { MessageNotificationCardProps } from "./MessageNotificationCard";
import { MessageNotificationCardList } from "./MessageNotificationCardList";
import { fetchPrivateConversations } from "@/lib/utils/fetchPrivateConversations";
import { useProfile } from "@/lib/store/profile";
import { Database } from "@/lib/types/database.types";
import { fetchBookmarkOpportunities } from "@/lib/utils/fetchBookmarkOpportunities";
import { createSupabaseClient } from "@/lib/supabase/client";
/**
 * Allows the user to navigate between company threads or private messages in the message page
 */
export function SideNav() {
  const { profile } = useProfile();
  const pathName = usePathname();
  const tabs = [
    {
      label: "Company Threads",
      tabPathName: "company",
      solidIcon: solidBuilding,
      regularIcon: regularBuilding,
    },
    {
      label: "Private",
      tabPathName: "private",
      solidIcon: solidMessage,
      regularIcon: regularMessage,
    },
  ];
  const router = useRouter();
  const currentTab = pathName.split("/")[2]; // tab is either company or private
  const [messageNotificationsList, setMessageNotificationsList] = useState<
    MessageNotificationCardProps[]
  >([]);
  const supabase = useMemo(() => createSupabaseClient(), []);

  // TODO: Need to test this
  useEffect(() => {
    if (profile) {
      if (currentTab === "company") {
        // filter does not exist on delete.
        const bookmarkChannel = supabase
          .channel("bookmark_opportunity_changes")
          .on(
            "postgres_changes",
            {
              schema: "public", // Subscribes to the "public" schema in Postgres
              event: "INSERT", // Listen to all changes
              table: "bookmark_opportunity",
              filter: `profile_id=eq.${profile.profile_id}`,
            },
            () => setOpportunityBookmarks(profile.profile_id)
          )
          .subscribe();

        return () => {
          bookmarkChannel.unsubscribe();
        };
      } else {
        // currentTab == "private"
        // filter does not exist on delete.
        const bookmarkChannel = supabase
          .channel("private_changes")
          .on(
            "postgres_changes",
            {
              schema: "public", // Subscribes to the "public" schema in Postgres
              event: "INSERT", // Listen to all changes
              table: "private_user_conversation",
              filter: `profile_id=eq.${profile.profile_id}`,
            },
            () => setPrivateConversationBookmarks(profile.profile_id)
          )
          .subscribe();

        return () => {
          bookmarkChannel.unsubscribe();
        };
      }
    }
  }, [pathName, currentTab, profile]);

  useEffect(() => {
    if (profile) {
      if (currentTab === "private") {
        setPrivateConversationBookmarks(profile.profile_id);
      } else {
        setOpportunityBookmarks(profile.profile_id);
      }
    }
  }, [pathName, currentTab, profile]);

  function setPrivateConversationBookmarks(profileId: string) {
    fetchPrivateConversations(profileId).then((res) => {
      const { data, error } = res;
      if (error) {
      } else if (data) {
        const mappedData: MessageNotificationCardProps[] = data.map((item) => {
          const { conversation_id } = item;
          const { avatar, username } =
            item.profile as unknown as Database["public"]["Tables"]["profile"]["Row"]; // it returns profile as an array of profiles
          return {
            avatar: avatar,
            conversation_id,
            header: username,
            subHeader: "",
          };
        });
        setMessageNotificationsList(mappedData);
      } else {
        setMessageNotificationsList([]);
      }
    });
  }

  function setOpportunityBookmarks(profileId: string) {
    fetchBookmarkOpportunities(profileId).then((res) => {
      const { data, error } = res;

      if (error) {
        // TODO: DO something here
      }

      if (data) {
        const mappedData: MessageNotificationCardProps[] = data.map((item) => {
          const opportunity = item.opportunity;
          const conversationId = item.opportunity.company_thread.thread_id;
          return {
            avatar: opportunity.company_name[0], // TODO Replace with the actual company avatar
            conversation_id: conversationId,
            header: opportunity.company_name,
            subHeader: `${opportunity.role_title},  ${opportunity.type}`,
          };
        });

        setMessageNotificationsList(mappedData);
      } else {
        setMessageNotificationsList([]);
      }
    });
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderRight: "3px solid #E0E4F2",
      }}
    >
      {" "}
      <div
        style={{
          padding: "20px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
          }}
        >
          Messages
        </Typography>
        <Typography>
          Talk to other applicants in the process, or talk privately
        </Typography>
        <Tabs
          value={currentTab}
          TabIndicatorProps={{
            style: {
              background: "#496FFF",
            },
          }}
          sx={{
            marginTop: "20px",
            justifySelf: "center",
            display: "flex",
            justifyContent: "center",
            justifyItems: "center",
            "&.Mui-selected": {
              color: "yellow",
              opacity: 1,
            },
            "&.Mui-focusVisible": {
              backgroundColor: "#d1eaff",
            },
          }}
        >
          {tabs.map(({ tabPathName, solidIcon, regularIcon, label }) => (
            <Tab
              value={tabPathName}
              key={tabPathName}
              sx={{
                padding: "0px",
                marginRight: "20px",
                "&.Mui-selected": {
                  color: "#496FFF",
                },
              }}
              icon={
                <FontAwesomeIcon
                  size="2x"
                  icon={
                    currentTab === tabPathName // gets the route name after the /message route
                      ? solidIcon
                      : regularIcon
                  }
                />
              }
              onClick={() => router.push(`/message/${tabPathName}`)}
              label={
                <Typography
                  sx={{
                    color: currentTab === tabPathName ? "#496FFF" : "#3C435C",
                  }}
                  variant="caption"
                >
                  {label}
                </Typography>
              }
            />
          ))}
        </Tabs>
      </div>
      <MessageNotificationCardList list={messageNotificationsList} />
    </div>
  );
}
