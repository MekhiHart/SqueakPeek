import { AboutHero } from "@/ui/about/AboutHero";
import { Typography } from "@mui/material";
import { AboutProfile, IAboutProfile } from "@/ui/about/AboutProfile";
import { AboutMission } from "@/ui/about/AboutMission";

export default function Page() {
  const aboutProfiles: IAboutProfile[] = [
    {
      name: "Mekhi Hart Dela Cruz",
      role: "Lead",
      description:
        "Mekhi Hart is a Software Engineer at Netflix and has vast experience developing software for video games, mobile, and web. He also likes to rock climb in his spare time.",
      linkedInURl: "https://www.linkedin.com/in/mekhihart-delacruz/",
      profilePic: "/about/profilepic_mekhi.png",
    },
    {
      name: "Mark Carson",
      role: "Full-Stack",
      description:
        "Mark Carson has a diverse background in full-stack development and machine learning applications. He spends time AFK playing piano and in the kitchen.",
      linkedInURl: "https://www.linkedin.com/in/markcarsondev/",
      profilePic: "/about/profilepic_mark.png",
    },
    {
      name: "David Serrano",
      role: "Full-Stack",
      description:
        "David Serrano is an aspiring software developer and or IT technician with a passion for fitness and a constant drive to learn and grow.",
      linkedInURl: "https://www.linkedin.com/in/david-serrano-0a6a5523a/",
      profilePic: "/about/profilepic_david.png",
    },
    {
      name: "Kate Steer",
      role: "Backend",
      description:
        "Kate Steer is a software developer with experience in database management and architecture, as well as application design. In her free time, she enjoys creating music and reading.",
      linkedInURl: "https://www.linkedin.com/in/kate-steer-4149001a6/",
      profilePic: "/about/profilepic_kate.png",
    },
    {
      name: "Hao Phan",
      role: "Full-Stack",
      description:
        "Hao Phan is a full-stack developer with experience in IT and automated flow, as well as a passion for web development. In his free time, he likes watching soccer and Formula 1.",
      linkedInURl: "https://www.linkedin.com/in/hao-phan-b049b91aa/",
      profilePic: "/about/profilepic_howie.png",
    },
    {
      name: "Noah Daniels",
      role: "Backend",
      description:
        "Noah Daniels is a software developer, data analyst, and machine learning engineer, with a passion for mathematics and music.",
      linkedInURl: "https://www.linkedin.com/in/noah-daniels-07b5401a9/",
      profilePic: "/about/profilepic_noah.png",
    },
    {
      name: "Mia Lang",
      role: "Artist",
      description:
        "Mia Lang is a BFA Animation Student at CSULB. She likes to cook and explore new restaurants in her local community.",
      linkedInURl: "https://www.linkedin.com/in/mia-lang-08bb1121b/",
      profilePic: "/about/profilepic_mia.png",
    },
  ];
  return (
    <div>
      <AboutHero />
      <AboutMission />
      <Typography
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
        variant="h4"
      >
        The Team
      </Typography>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto",
        }}
      >
        {aboutProfiles.map((profile) => (
          <AboutProfile key={profile.name} {...profile} />
        ))}
      </div>
    </div>
  );
}
