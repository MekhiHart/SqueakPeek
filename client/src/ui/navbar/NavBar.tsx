"use client";
import Link from "next/link";
import { IconButton, Tooltip, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMessage,
  faChartLine,
  faMagnifyingGlass,
  IconDefinition,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";
import { NavbarMenuDropdown } from "./NavbarMenuDropdown";
import { LogoNameLink } from "./LogoNameLink";
import { useMessageNotification } from "@/lib/store/messageNotification";
import { useInterstitial } from "@/lib/store/interstitial";

interface ILinks {
  name: string;
  href: string;
  icon: IconDefinition;
}
export function NavBar() {
  const links: ILinks[] = [
    {
      name: "Explore",
      href: "/explore",
      icon: faMagnifyingGlass,
    },
    {
      name: "Message",
      href: "/message",
      icon: faMessage,
    },
    {
      name: "Tracking",
      href: "/track",
      icon: faChartLine,
    },
  ];
  const pathName = usePathname();
  const { privateNotifications } = useMessageNotification();
  const numPrivateNotifications = privateNotifications.filter(
    (notification) => notification.isRead === false
  ).length;
  const { renderInterstitial } = useInterstitial();
  return (
    // Navbar container
    <nav
      style={{
        background: "white",
        height: "80px",
        display: "flex",
        zIndex: 1,
        position: "sticky",
        borderBottom: "3px solid #E0E4F2",
        alignContent: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Container for logo and navigation links. Note: This is to align these element to left while the drop down is aligned to the right  */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Logo Section Note: Links to explore page because that will be our users homepage */}
        <LogoNameLink href="/explore" />

        {/* Navigations links section Note: Similar to landingnavbar but has inlcuded FA icons */}

        <ul
          style={{
            display: "flex",
            listStyle: "none",
            textAlign: "center",
          }}
        >
          {links.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                style={{
                  color: "#3C435C",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "30px",
                }}
              >
                <div
                  style={{
                    marginRight: "7px",
                  }}
                >
                  {link.name === "Message" && numPrivateNotifications > 0 && (
                    <div
                      style={{
                        position: "absolute",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "white",
                          position: "relative",
                          width: "16px",
                          height: "16px",
                          left: "22%",
                          bottom: "13px",
                          backgroundColor: "#496FFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "30px",
                          border: "2px solid white",
                          fontSize: "10px",
                        }}
                        variant="caption"
                      >
                        {numPrivateNotifications <= 9
                          ? numPrivateNotifications
                          : "9+"}
                      </Typography>
                    </div>
                  )}
                  <FontAwesomeIcon icon={link.icon} />
                </div>
                <Typography
                  sx={{
                    fontWeight: pathName.startsWith(link.href)
                      ? "bold"
                      : "normal",
                  }}
                >
                  {link.name}
                </Typography>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Dropdown Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Tooltip
          sx={{
            marginRight: "10px",
          }}
          title="Support"
          onClick={() => renderInterstitial("SupportModal")}
        >
          <IconButton>
            <FontAwesomeIcon
              style={{
                color: "#3C435C",
              }}
              icon={faHeadset}
            />
          </IconButton>
        </Tooltip>
        <NavbarMenuDropdown />
      </div>
    </nav>
  );
}
