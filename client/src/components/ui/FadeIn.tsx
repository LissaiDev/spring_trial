import { motion } from "framer-motion";

const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

export function FadeIn({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
        >
            {children}
        </motion.div>
    );
}
