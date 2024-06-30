import * as React from "react";
import { alpha } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const images = [
  "/shot1.png",
  "/shot2.png",
  "/shot3.png",
  "/shot4.png",
  // Add more image paths as needed
];

export default function Hero() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    infinite: true
  };

  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        backgroundImage:
          theme.palette.mode === "light"
            ? "linear-gradient(270deg, #CEE5FD, #FFFE)"
            : `linear-gradient(#02294F, ${alpha("#090E10", 0.0)})`,
        backgroundSize: "100%",
        // backgroundRepeat: "no-repeat",
      })}>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}>
        <Stack spacing={2} useFlexGap sx={{ width: { xs: "100%", sm: "70%" } }}>
          <Typography
            variant="h1"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignSelf: "center",
              textAlign: "center",
              fontSize: "clamp(3.5rem, 10vw, 4rem)",
            }}>
            Empowering Wholesalers, Connecting Investors, Fueling Growth. &nbsp;
            {/* <Typography
              component="span"
              variant="h1"
              sx={{
                fontSize: "clamp(3rem, 10vw, 4rem)",
                color: (theme) =>
                  theme.palette.mode === "light"
                    ? "primary.main"
                    : "primary.light",
              }}>
              product
            </Typography> */}
          </Typography>
          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{ alignSelf: "center", width: { sm: "100%", md: "80%" } }}>
            Explore our vast community. A network of sellers, buyers and investors.Welcome to the world of business.
            {/* cutting-edge dashboard, delivering high-quality
            solutions tailored to your needs. Elevate your experience with
            top-tier features and services. */}
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignSelf="center"
            spacing={1}
            useFlexGap
            sx={{ pt: 2, width: { xs: "100%", sm: "auto" } }}></Stack>
        </Stack>
        <Box
          id="image"
          sx={{
            // mt: { xs: 8, sm: 10 },
            alignSelf: "center",
            width: "100%",
            maxWidth: "1260px",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: 10,
          }}>
          <Slider {...settings}>
            {images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  height: { xs: 200, sm: 700 },
                  backgroundImage: `url(${image})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              />
            ))}
          </Slider>
        </Box>
      </Container>
    </Box>
  );
}
