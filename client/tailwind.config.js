/** @type {import('tailwindcss').Config} */
export const content = ['./src/**/*.{js,ts,jsx,tsx}'];
export const plugins = [require("daisyui")];
export const daisyui = {
  themes: [
    {
      Spies: {
        // white
        primary: "#ff8787",
        // black
        secondary: "#343a40",
        // red
        accent: "#868e96",
        // grey
        neutral: "#eeeeee",
        "base-100": "#3F4242",
        // red
        info: "#ff8585",
        // blue
        success: "#4477b3",
        // yellow
        warning: "#f8ff7a",
        // green
        error: "#bc4749"
      },
    },
    'business',
    "dracula",
    "cyberpunk",
    "coffee",
    'pastel',
    'luxury',
    'emerald'
  ]
};

