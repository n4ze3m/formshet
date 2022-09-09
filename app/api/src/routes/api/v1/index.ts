import { FastifyPluginAsync } from "fastify";

const root: FastifyPluginAsync = async (fastify): Promise<void> =>{
    fastify.get("/", async (request, reply) => {
        return {
            version: "v1"
        }
    })
}


export default root;