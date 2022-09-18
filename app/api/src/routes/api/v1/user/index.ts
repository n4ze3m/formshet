import { FastifyPluginAsync } from "fastify";
import { userLogin, userRegister } from "./handlers";
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
            payload
        }
    });

    fastify.post<Register>("/register", async (request, reply) => {
        const payload = await userRegister(request, reply);
        const token = fastify.jwt.sign(payload);
        return {
            token,
            payload
        }
    });
}


export default root;