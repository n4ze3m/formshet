import { FastifyPluginAsync } from "fastify";
import {
  createSheet,
  deleteForm,
  getSheetById,
  getUserForms,
  submitSheetForm,
  verifySheet,
  getUserFormIntergation,
  updateFormIntergation,
  getUserFormCode,
  getUserFormSettings,
} from "./handlers";
import {
  DeleteSheetForm,
  GetSheetByID,
  SheetByIDUpdate,
  SubmitSheetForm,
  VerifySheet,
} from "./types";
const root: FastifyPluginAsync = async (fastify): Promise<void> => {
  // api to get form data from sheet to react frontend
  fastify.get<GetSheetByID>(
    "/:formId",
    {
      onRequest: [fastify.authenticate],
    },
    getSheetById
  );
  // api to get integration from third party
  fastify.get<GetSheetByID>(
    "/:formId/integration",
    {
      onRequest: [fastify.authenticate],
    },
    getUserFormIntergation
  );
  // api to update integration from third party
  fastify.put<SheetByIDUpdate>(
    "/:formId/integration",
    {
      onRequest: [fastify.authenticate],
    },
    updateFormIntergation
  );
  // api to get code from third party
  fastify.get<GetSheetByID>(
    "/:formId/code",
    {
      onRequest: [fastify.authenticate],
    },
    getUserFormCode
  );
  // api tp get form settings
  fastify.get<GetSheetByID>(
    "/:formId/settings",
    {
      onRequest: [fastify.authenticate],
    },
    getUserFormSettings
  );

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
  fastify.get(
    "/all",
    {
      onRequest: [fastify.authenticate],
    },
    getUserForms
  );

  // api to delete form
  fastify.delete<DeleteSheetForm>(
    "/:id",
    {
      onRequest: [fastify.authenticate],
    },
    deleteForm
  );
};

export default root;
