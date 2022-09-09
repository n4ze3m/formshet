import fastify from "fastify";
import cors from "@fastify/cors"
const PORT = 3000;
const HOST = "0.0.0.0";
const main = async () => {
    const app = fastify({ logger: true });
    app.register(cors);


    app.get("/", async (request, reply) => {
        return { hello: "world" };
    })

    app.listen({
        port: PORT,
        host: HOST
    }, (err, address) => {
        if (err) {
            app.log.error(err);
            process.exit(1);
        }
        app.log.info(`server listening on ${address}`);
    });
}

main();