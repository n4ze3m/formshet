import { FastifyPluginAsync } from "fastify";
import {
    createSheet,
    getSheetById,
    getUserForms,
    submitSheetForm,
    verifySheet,
} from "./handlers";
import { GetSheetByID, SubmitSheetForm, VerifySheet } from "./types";
const root: FastifyPluginAsync = async (fastify): Promise<void> => {
    // api to get form data from sheet to react frontend
    fastify.get<GetSheetByID>("/:formId", {
        onRequest: [fastify.authenticate],
    }, getSheetById);
    // api to submit form from frontend
    fastify.post<SubmitSheetForm>("/:id/submit", submitSheetForm);
    // api to verify sheet is valid or not
    fastify.post<VerifySheet>(
        "/verify",
        {
            onRequest: [fastify.authenticate],
        },
        verifySheet
    );
    // api to create form to local db
    fastify.post(
        "/create",
        {
            onRequest: [fastify.authenticate],
        },
        createSheet
    );
    // api to get all forms from local db
    fastify.get("/all", {
        onRequest: [fastify.authenticate],
    }, getUserForms)
};

export default root;
