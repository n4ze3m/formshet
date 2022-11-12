import fastify from "fastify";
import cors from "@fastify/cors";
import env from "@fastify/env";
import autoload from "@fastify/autoload";
import formbody from "@fastify/formbody";
import multipart from "@fastify/multipart";
import serve from "@fastify/static";
import * as path from "path";

declare module "fastify" {
	interface FastifyInstance {
		config: {
			FORMSHET_SECRET_KEY: string;
			FORMSHET_HOST: string;
			FORMSHET_NOTIFICATIONS_PROVIDER: string;
			FORMSHET_COURIER_AUTH_TOKEN: string;
			FORMSHET_COURIER_TEMPLATE_ID: string;
		};
	}
}

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
	// server static file
	if (process.env.NODE_ENV === "production") {
		app.register(serve, {
			root: path.join(__dirname, "./public"),
			preCompressed: true,
		});
		app.setNotFoundHandler(async function (request, reply) {
			if (request.raw.url?.startsWith("/api")) {
				return reply.status(404).send({
					success: false,
				});
			}
			return reply.status(200).sendFile("index.html");
		});
	}
	app.register(env, {
		dotenv: true,
		schema: {
			type: "object",
			required: ["FORMSHET_SECRET_KEY", "FORMSHET_GOOGLE_CRED_PATH"],
			properties: {
				FORMSHET_SECRET_KEY: {
					type: "string",
				},
				FORMSHET_DATABASE_URL: {
					type: "string",
					default: "file:../db/database.db",
				},
				FORMSHET_HOST: {
					type: "string",
					default: "http://localhost:3000",
				},
				FORMSHET_GOOGLE_CRED_PATH: {
					type: "string",
				},
				FORMSHET_NOTIFICATIONS_PROVIDER: {
					type: "string",
					default: "courier",
				},
				FORMSHET_COURIER_AUTH_TOKEN: {
					type: "string",
				},
				FORMSHET_COURIER_TEMPLATE_ID: {
					type: "string",
				},
			},
		},
	});
	// load plugins
	app.register(autoload, {
		dir: path.join(__dirname, "plugins"),
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
		},
	);
};

main();
