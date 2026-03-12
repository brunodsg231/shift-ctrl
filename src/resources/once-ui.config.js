const baseURL = "http://localhost:3000";

import { Geist } from "next/font/google";
import { Geist_Mono } from "next/font/google";

const heading = Geist({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const body = Geist({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const label = Geist({
  variable: "--font-label",
  subsets: ["latin"],
  display: "swap",
});

const code = Geist_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

const fonts = {
  heading: heading,
  body: body,
  label: label,
  code: code,
};

const style = {
  theme: "dark",
  neutral: "gray",
  brand: "yellow",
  accent: "cyan",
  solid: "contrast",
  solidStyle: "flat",
  border: "playful",
  surface: "translucent",
  transition: "all",
  scaling: "100",
};

const dataStyle = {
  variant: "flat",
  mode: "categorical",
  height: 24,
  axis: {
    stroke: "var(--neutral-alpha-weak)",
  },
  tick: {
    fill: "var(--neutral-on-background-weak)",
    fontSize: 11,
    line: false,
  },
};

const meta = {
  home: {
    path: "/",
    title: "SHIFT CTRL",
    description: "Epson projector and Resolume event controller",
    image: "",
    canonical: "http://localhost:3000",
    robots: "noindex,nofollow",
    alternates: [],
  },
};

const schema = {
  logo: "",
  type: "Organization",
  name: "SHIFT CTRL",
  description: meta.home.description,
  email: "",
};

const social = {};

export { baseURL, fonts, style, meta, schema, social, dataStyle };
