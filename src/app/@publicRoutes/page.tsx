"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GiRollingDices } from "react-icons/gi";
import { useRouter } from "next/navigation";

export default function UnauthenticatedHome() {
    const [diceRoll, setDiceRoll] = useState(1);
    const router = useRouter();

    const rollDice = () => {
        setDiceRoll(Math.floor(Math.random() * 20) + 1);
    };

    // @ts-ignore
    const navigateToLogin = (event) => {
        event.preventDefault();
        router.push("/login");
    };

    // @ts-ignore
    const navigateToRegister = (event) => {
        event.preventDefault();
        router.push("/register");
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center  text-white p-6">
            {/* Magical Title Animation */}
            <motion.h1
                className="text-5xl font-bold text-center text-red-600 drop-shadow-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                Welcome to BeyonD&D
            </motion.h1>

            {/* Foggy Ambiance */}
            <motion.div
                className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#321717] to-transparent opacity-50"
                animate={{ opacity: [8, 4, 9] }}
                transition={{ duration: 6, repeat: Infinity, repeatType: "mirror" }}
            ></motion.div>

            {/* Description */}
            <p className="text-lg text-center mt-4 max-w-2xl text-olive-300">
                Enter a realm of adventure, magic, and storytelling. Create your character, join epic quests, and explore endless possibilities!
            </p>

            {/* Dice Roller */}
            <motion.div
                className="mt-6 flex flex-col items-center"
                whileHover={{ scale: 1.1 }}
            >
                <motion.div
                    className="text-6xl text-red-500"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1 }}
                >
                    <GiRollingDices />
                </motion.div>
                <p className="mt-2 text-2xl text-olive-300">You rolled a {diceRoll}!</p>
                <Button className="mt-2 bg-red-600 hover:bg-red-800 text-olive-300" onClick={rollDice}>
                    Roll the Dice
                </Button>
            </motion.div>

            {/* Themed Buttons */}
            <div className="mt-6 flex gap-4">
                <Button className="bg-red-700 hover:bg-red-900 px-6 py-3 text-lg text-olive-300" onClick={navigateToRegister}>Register</Button>
                <Button className="bg-olive-600 hover:bg-olive-800 px-6 py-3 text-lg text-red-300" onClick={navigateToLogin}>Log In</Button>
            </div>
        </div>
    );
}