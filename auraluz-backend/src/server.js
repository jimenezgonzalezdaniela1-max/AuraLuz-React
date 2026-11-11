import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB, disconnectDB } from "./config/db.js";

async function main() {
  await connectDB();
  const server = app.listen(env.port, () => {
    console.log(`API lista en http://localhost:${env.port}`);
  });

  const shutdown = async (signal) => {
    console.log(`\n${signal} recibido, cerrando…`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((err) => {
  console.error("No se pudo iniciar el servidor:", err.message);
  process.exit(1);
});
