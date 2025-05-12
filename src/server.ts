import dotenv from "dotenv";
import { createApp } from "./app";

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

const app = createApp(PORT);
app.start();

process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  await app.stop();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT signal received: closing HTTP server");
  await app.stop();
  process.exit(0);
});
