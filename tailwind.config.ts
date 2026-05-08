import { type Config } from "tailwindcss";

const config: Config = {
    theme: {
        extend: {
            colors: {
                studio: {
                    black: "#050505",
                    cream: "#F2F0EA",
                    white: "#FAF9F4",

                    red: "#F04A24",
                    redDark: "#3A0505",
                    redMuted: "#9E2E1F",

                    clay: "#B84A2B",
                    terracotta: "#C95A35",
                    sand: "#D8B99A",

                    wood: "#7A4A36",
                    olive: "#687448",
                    moss: "#3F4A2F",
                },
            },
        },
    },
};

export default config;
