import Image from "next/image";
import { Typography, Box, Select, MenuItem } from "@mui/material";
import { InputField } from "../InputField";

// TODO Finish UI
export function SupportModal() {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: "8px",
        justifyContent: "center",
      }}
    >
      <Image
        src="/general/website_logo.svg"
        height={100}
        width={100}
        alt="Squeakpeek Logo"
        style={{}}
      />
      <Typography
        sx={{
          paddingBottom: "16px",
        }}
        variant="h3"
      >
        Support
      </Typography>
      <InputField
        label="Summary"
        required
        name="summary"
        placeholder="Summary"
      />
      <Select label="Options" title="options" required></Select>
    </Box>
  );
}
