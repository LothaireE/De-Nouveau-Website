"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const LOGO_SRC = "/DE_NOUVEAU/SVG/AAAA_BLACK_02.svg";

export default function LoadingLogo() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-studio">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                    opacity: [0.4, 1, 0.4],
                    scale: [0.96, 1, 0.96],
                    rotate: 360,
                }}
                transition={{
                    opacity: {
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                    },
                    scale: {
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                    },
                    rotate: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                    },
                }}
            >
                <Image
                    src={LOGO_SRC}
                    alt=""
                    priority
                    className="h-auto w-full"
                    width={64}
                    height={64}
                />
            </motion.div>
        </div>
    );
}
