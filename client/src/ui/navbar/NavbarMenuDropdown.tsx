import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { Typography, Tooltip, ListItemIcon, ListItemText } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faUser,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { CurrentProfileAvatar } from "./CurrentProfileAvatar";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useProfile } from "@/lib/store/profile";

export function NavbarMenuDropdown() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const supabase = createSupabaseClient();
  const { profile } = useProfile();

  //function to open menu
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  //closes menu when called
  const handleClose = () => {
    setAnchorEl(null);
  };

  // router to push to profile page
  const router = useRouter();

  // funciton to push to profile page
  const pushToProfile = () => {
    router.push("/profile");
  };

  // function to handle login logic
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error.message);
      } else {
        // Redirect homepage after signing out
        router.push("/");
      }
    } catch (error) {
      console.error("Unexpected error during sign-out:", error);
    }
  };

  return (
    <div
      style={{
        justifyContent: "center",
        alignContent: "center",
        marginRight: "15px",
      }}
    >
      {/* IconButton Section Note: Image should be replaced in future with users avatar choice*/}
      <Tooltip title={profile ? profile.username : ""}>
        <IconButton
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          size="small"
        >
          <CurrentProfileAvatar />
        </IconButton>
      </Tooltip>

      {/* Menu open arrow */}
      <FontAwesomeIcon
        icon={open ? faChevronUp : faChevronDown}
        style={{ marginLeft: "8px", color: "#e0e4f2" }}
      />

      {/* Menu Note: Styling is handled using the Paper root*/}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            boxShadow: "#959DA533 0px 8px 24px",
            border: "solid 2px #e0e4f2",
          },
        }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        transformOrigin={{
          vertical: -5,
          horizontal: 0,
        }}
      >
        {/* List of menu items */}

        {/* Profile menu item. onclick fucntions both close the dropdown menu and push to profile page */}
        <MenuItem
          onClick={() => {
            handleClose();
            pushToProfile();
          }}
        >
          <ListItemIcon>
            <FontAwesomeIcon icon={faUser} style={{ color: "#3C435C" }} />
          </ListItemIcon>

          <ListItemText>
            <Typography variant="body1">Profile</Typography>
          </ListItemText>
        </MenuItem>

        {/* Logout menu item. onclick function include closing the menu "note may not be necessary" and a function to handle the logout logic */}
        <MenuItem
          onClick={() => {
            handleClose();
            handleLogout();
          }}
        >
          <ListItemIcon>
            <FontAwesomeIcon
              icon={faRightFromBracket}
              style={{ color: "#3C435C" }}
            />
          </ListItemIcon>

          <ListItemText>
            <Typography variant="body1">Logout</Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
}
