import { FastifyPluginAsync } from "fastify";
import { getSheetById } from "./handlers"
const root: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.get("/:id", getSheetById)
}


export default root;