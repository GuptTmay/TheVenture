import dotenv from "dotenv";
dotenv.config();

export const port = 3000;
export const API_PREFIX = "/api/v1";
export const salt_rounds = 10; 
export const FRONTEND_URL = process.env.FRONTEND_URL;

export const JWT = {
    SECRET_KEY: "shhhhhhhhhhhh!",
    TOKEN_EXP: 60 * 60 * 24 * 7, // 1 Week
}

export const REDIS = {
    USERNAME: process.env.REDIS_DB_USERNAME!,
    PASSWORD: process.env.REDIS_DB_PASSWORD!,
    HOST: process.env.REDIS_DB_HOST!,
    PORT: parseInt(process.env.REDIS_DB_PORT!, 10),
};

export const BotMail = {
    user: process.env.BOTMAIL_USER,  
    pass: process.env.BOTMAIL_PASS 
}