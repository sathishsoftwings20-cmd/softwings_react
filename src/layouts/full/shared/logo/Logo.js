import { Link } from "react-router";
import LogoDark1 from "src/assets/images/logos/sotwings.png";
import { styled, Box } from "@mui/material";

const LinkStyled = styled(Link)(() => ({
  height: "auto",
  width: "140px",
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  return (
    <LinkStyled
      to="/"
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        component="img"
        src={LogoDark1}
        alt="Logo"
        sx={{
          width: "140px",
          height: "auto",
          display: "block",
        }}
      />
    </LinkStyled>
  );
};

export default Logo;
