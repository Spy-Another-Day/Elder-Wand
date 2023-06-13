/** @type {import('tailwindcss').Config} */
export const content = ['./src/**/*.{js,ts,jsx,tsx}'];
export const plugins = [require("daisyui")];
export const daisyui = {
  themes: [
    'business',
    {
      Stigander: {
        // green
        primary: "#6a994e",
        // darker green
        secondary: "#386641",
        // red
        accent: "#bc4749",
        // cream / parchment / off white
        neutral: "#f2e8cf",
        // lighter green
        "base-100": "#a7c957",
        // orange
        info: "#f4a259",
        // yellow
        success: "#f4e285",
        // another green
        warning: "#8cb369",
        // a blueish green
        error: "#5b8e7d"
      },
      Zaris: {
        // green
        primary: "#ced4da",
        // darker green
        secondary: "#343a40",
        // black
        accent: "#1e1e1e",
        // white
        neutral: "#ffffff",
        // off white
        "base-100": "#e9ecef",
        // red
        info: "#ffc9c9",
        // orange
        success: "#ffd8a8",
        // yellow
        warning: "#eeffaa",
        // purple
        error: "#d0bfff"
      },
    },
    "light",
    "retro",
    "dracula",
    "aqua",
    "cyberpunk",
    "dark",
    "coffee"
  ]
};

