import fastify from "fastify";
import cors from "@fastify/cors";
import env from "@fastify/env";
import autoload from "@fastify/autoload";
import formbody from "@fastify/formbody";
import multipart from "@fastify/multipart";
import path from "path";
const main = async () => {
  const app = fastify({ logger: true });
  // constants
  const PORT = 3000;
  const HOST = "0.0.0.0";
  // enable  cors
  app.register(cors);
  // enable urlencoded
  app.register(formbody);
  // enable multipart
  app.register(multipart, { attachFieldsToBody: true });
  // load env
  app.register(env, {
    dotenv: true,
    schema: {},
  });
  // load routes
  app.register(autoload, {
    dir: path.join(__dirname, "routes"),
  });
  // start server
  app.listen(
    {
      port: PORT,
      host: HOST,
    },
    async (err, address) => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }
      app.log.info(`server listening on ${address}`);
    }
  );
};

main();
