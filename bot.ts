import { Client } from "discord.js";
import { Bot } from "@components/Bot";
import { Logger } from "@components/Log";

Logger.log({ type: "STARTUP", msg: "Osaka is waking up..." });

export const bot = new Bot(
    new Client({
        allowedMentions: { parse: ["roles", "users"] },
        intents: 47095
    })
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "Reason:", reason);
    // You may want to handle this error more gracefully or log it to your error tracking system.
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    // You may want to handle this error more gracefully or log it to your error tracking system.
});

// Handle uncaught exceptions that were not caught by a domain or try-catch
process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.error("Uncaught Exception Monitor:", err, "Origin:", origin);
    // You may want to handle this error more gracefully or log it to your error tracking system.
});

// Handle TypeScript type errors (requires ts-node or similar)
process.on("unhandledTypeErrors", (error) => {
    console.error("Unhandled Type Error:", error);
    // You may want to handle this error more gracefully or log it to your error tracking system.
});