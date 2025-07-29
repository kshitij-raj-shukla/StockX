/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                'dark-bg': '#1a202c',   // Dark gray background
                'card-bg': '#2d3748',   // Slightly lighter gray for cards
                'highlight': '#3182ce', // Blue accent for buttons, links, graphs
            },
        },
    },
    plugins: [],
};