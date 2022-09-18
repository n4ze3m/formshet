import { FastifyPluginAsync } from "fastify";
import { getSheetById, submitSheetForm, verifySheet } from "./handlers"
import { VerifySheet } from "./types";
const root: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.get("/:id", getSheetById)
    fastify.post("/:id/submit", submitSheetForm)
    fastify.post<VerifySheet>("/verify", {
        onRequest: [fastify.authenticate]
    }, verifySheet)
}


export default root;