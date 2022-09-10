import { FastifyPluginAsync } from "fastify";
import { getSheetById, submitSheetForm } from "./handlers"
const root: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.get("/:id", getSheetById)
    fastify.post("/form/:id", submitSheetForm)
}


export default root;