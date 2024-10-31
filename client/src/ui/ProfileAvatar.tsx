"use client";
import { Avatar } from "@mui/material";
import { AvatarProps } from "@mui/material";
import { Database } from "@/lib/types/database.types";

export type AvatarTypes = Database["public"]["Enums"]["Avatar"];
/**
 * Returns the Avatar based on the avatar prop
 */
export function ProfileAvatar({
  avatar,
  ...props
}: {
  avatar: AvatarTypes;
} & AvatarProps) {
  // TODO: Change this to the actual mapping to the correct avatar images
  // TODO (BUG): On page refresh, or any situation that turns profile = null, it defaults to the image, creating a janky look when profile is initialize
  const avatarMaps = {
    avatar1: "/avatars/cool_rat.svg",
    avatar2: "/avatars/incognito_rat.svg",
    avatar3: "/avatars/peephole_rat.svg",
    avatar4: "/avatars/professional_rat.svg",
  };
  return (
    <Avatar
      style={{
        width: "55px",
        height: "55px",
      }}
      src={avatar ? avatarMaps[avatar] : "/landingpage/track.svg"}
      {...props}
    />
  );
}
