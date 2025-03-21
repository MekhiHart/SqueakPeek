import { CardHeader, Avatar, Skeleton } from "@mui/material";
import { useConversation } from "@/lib/store/conversation";
import { useEffect, useState } from "react";
import { useProfile, Profile } from "@/lib/store/profile";
import { ProfileAvatar, AvatarTypes } from "../ProfileAvatar";
import { Database } from "@/lib/types/database.types";
import { fetchCompanyThreadMetaData } from "@/lib/utils/fetchCompanyThreadMetaData";
import { fetchPrivateConversationMetaData } from "@/lib/utils/fetchPrivateConversationMetaData";
import { OpportunityBookmark } from "./OpportunityBookmark";
import { useFetchCompanyLogo } from "@/lib/hooks/useFetchCompanyLogo";
import { useAlert } from "@/lib/store/alert";
import { CardSkeleton } from "./CardSkeleton";

interface ConversationHeaderProps {
  conversationId: string;
}
/**
 * Header section of the Conversation component
 * @param conversationId - id of the conversation. Either a company thread or a private conversation
 */
export function ConversationHeader({
  conversationId,
}: ConversationHeaderProps) {
  const { isPrivateConversation } = useConversation();
  const { profile } = useProfile();
  const [header, setHeader] = useState("");
  const [subHeader, setSubHeader] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [profileAvatar, setProfileAvatar] = useState<AvatarTypes | null>();
  const companyLogoURL = useFetchCompanyLogo(header);
  const { setAlert } = useAlert();

  useEffect(() => {
    const ignoreErrorCode = "PGRST116"; // error occurs when fetching header metadata from a different conversation type
    if (isPrivateConversation && profile) {
      fetchPrivateConversationMetaData(conversationId, profile.profile_id).then(
        (res) => {
          const { data, error } = res;
          if (error && error.code !== ignoreErrorCode) {
            setAlert({
              message: "Failed to fetch coversation header",
              type: "error",
            });
          } else if (data) {
            const conversationMetaData = data.profile as unknown as Profile;
            setHeader(conversationMetaData.username);
            setProfileAvatar(conversationMetaData.avatar);
            setIsLoading(false);
          }
        }
      );
    } else if (!isPrivateConversation && profile) {
      fetchCompanyThreadMetaData(conversationId).then((res) => {
        const { data, error } = res;

        if (error && error.code !== ignoreErrorCode) {
          setAlert({
            message: "Failed to fetch company thread header",
            type: "error",
          });
        }
        if (data) {
          const opportunityMetaData =
            data.opportunity as unknown as Database["public"]["Tables"]["opportunity"]["Row"];
          setHeader(opportunityMetaData.company_name);
          setSubHeader(
            opportunityMetaData.role_title + ", " + opportunityMetaData.type
          );
          setIsLoading(false);
        }
      });
    }
  }, [isPrivateConversation, profile, conversationId, setAlert]);

  if (isLoading) {
    return <CardSkeleton titleWidth="100px" subheaderWidth="175px" />;
  } else {
    if (isPrivateConversation) {
      return (
        <CardHeader
          title={header}
          subheader={subHeader}
          avatar={
            <ProfileAvatar width={40} height={40} avatar={profileAvatar!} />
          }
          sx={{
            boxShadow: "rgba(224,228,242,.7) 0px 2px 2px 0px",
            zIndex: 1,
          }}
        />
      );
    } else {
      return (
        <CardHeader
          action={
            <OpportunityBookmark
              isDisabled={isLoading}
              conversationId={conversationId}
              size=""
            />
          }
          title={header}
          subheader={subHeader}
          avatar={
            <Avatar alt={`Profile of ${header}`} src={companyLogoURL}>
              <Skeleton variant="circular" animation="wave" />
            </Avatar>
          }
          sx={{
            boxShadow: "rgba(224,228,242,.7) 0px 2px 2px 0px",
            zIndex: 1,
          }}
        />
      );
    }
  }
}
