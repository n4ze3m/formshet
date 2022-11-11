import { FastifyPluginAsync } from "fastify";
import {
	userLogin,
	userRegister,
	userSettings,
	updateUserAdminSettings,
	updateUserPassword,
	updateUserProfileSettings,
} from "./handlers";
import { Login, Register } from "./types";
const root: FastifyPluginAsync = async (fastify): Promise<void> => {
	fastify.get("/", async (request, reply) => {
		return reply.redirect(302, "/");
	});

	fastify.post<Login>("/login", async (request, reply) => {
		const payload = await userLogin(request, reply);
		const token = fastify.jwt.sign(payload);
		return {
			token,
			payload,
		};
	});

	fastify.post<Register>("/register", async (request, reply) => {
		const payload = await userRegister(request, reply);
		const token = fastify.jwt.sign(payload);
		return {
			token,
			payload,
		};
	});

	fastify.get(
		"/settings",
		{
			onRequest: [fastify.authenticate],
		},
		userSettings,
	);
	fastify.post(
		"/settings/profile",
		{
			onRequest: [fastify.authenticate],
		},
		updateUserProfileSettings,
	);
	fastify.post(
		"/settings/password",
		{
			onRequest: [fastify.authenticate],
		},
		updateUserPassword,
	);
	fastify.post(
		"/settings/admin",
		{
			onRequest: [fastify.authenticate],
		},
		updateUserAdminSettings,
	);
};

export default root;
