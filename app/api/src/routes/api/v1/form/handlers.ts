import { FastifyReply, FastifyRequest } from "fastify";
import dayjs from "dayjs";
import { generateHTMLCode } from "../../../../utils/code";
import { prisma } from "../../../../utils/common";
import {
  convertToArrayOfObject,
  convertToArrayOfRow,
} from "../../../../utils/digest";
import { generateApiKey } from "../../../../utils/key";
import {
  getSheetHeaders,
  getSheetId,
  googleSheet,
} from "../../../../utils/sheet";
import {
  CreateSheet,
  DeleteSheetForm,
  GetSheetByID,
  SheetByIDUpdate,
  SubmitSheetForm,
  VerifySheet,
} from "./types";

// formshit@ivisit-283003.iam.gserviceaccount.com

export const getSheetById = async (
  request: FastifyRequest<GetSheetByID>,
  reply: FastifyReply
) => {
  // get id from param
  const { formId } = request.params;
  const { userId } = request.user;
  const sheet = await googleSheet();

  const form = await prisma.form.findFirst({
    where: {
      id: formId,
      userId,
    },
  });

  if (!form) {
    return reply.status(404).send({
      message: "Form not found",
    });
  }

  const id = form.sheetId;

  try {
    // get column names
    const columnNames = await sheet.spreadsheets.values.get({
      spreadsheetId: id,
      range: "A1:Z1",
    });
    // get rows of data
    const rows = await sheet.spreadsheets.values.get({
      spreadsheetId: id,
      range: "A2:Z",
    });

    const data = convertToArrayOfObject(
      columnNames.data.values || [],
      rows.data.values || []
    );

    return {
      data: {
        header: columnNames.data.values || [],
        rows: data,
        numberOfRows: data.length,
      },

      form,
    };
  } catch (e) {
    return reply.status(500).send({
      message: "Something went wrong",
    });
  }
};

export const submitSheetForm = async (
  request: FastifyRequest<SubmitSheetForm>,
  reply: FastifyReply
) => {
  // get params
  const { id } = request.params;
  const supportedTypes = [
    "application/x-www-form-urlencoded",
    "application/json",
  ];
  let data: {};
  if (!supportedTypes.includes(request.headers["content-type"])) {
    return reply.status(400).send({
      message: "Invalid content type",
    });
  }
  data = request.body;
  // if no data or data is empty
  if (!data || Object.keys(data).length === 0) {
    reply.status(400).send({
      error: "No data provided",
    });
  }

  const form = await prisma.form.findFirst({
    where: {
      publicId: id,
      disabled: false,
    },
  });

  if (!form) {
    return reply.status(404).send({
      message: "Form not found",
    });
  }

  const sheetId = form.sheetId;

  const sheet = await googleSheet();
  // get column names
  const columnNames = await sheet.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "A1:Z1",
  });

  const row = convertToArrayOfRow(columnNames.data.values || [], data);
  // append row
  await sheet.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "A2:Z",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [row],
    },
  });
  // after this let's send a response and save a snapshot of the data
  await prisma.formSubmission.create({
    data: {
      data: JSON.stringify(data),
      formId: form.id,
    },
  });
  return {
    message: "Thanks for submitting the form",
  };
};

export const verifySheet = async (
  request: FastifyRequest<VerifySheet>,
  reply: FastifyReply
) => {
  const { url } = request.body || {};

  if (!url) {
    return reply.status(400).send({
      error: "No url provided",
    });
  }
  const id = getSheetId(url);
  if (!id) {
    return reply.status(400).send({
      error: "Invalid url",
    });
  }
  const sheet = await googleSheet();
  // get sheet name
  try {
    const sheetName = await sheet.spreadsheets.get({
      spreadsheetId: id,
    });

    return {
      name: sheetName.data.properties?.title,
      id,
    };
  } catch (error) {
    return reply.status(400).send({
      error: "You don't have access to this sheet",
    });
  }
};

export const createSheet = async (
  request: FastifyRequest<CreateSheet>,
  reply: FastifyReply
) => {
  const { url } = request.body || {};

  if (!url) {
    return reply.status(400).send({
      error: "No url provided",
    });
  }
  const id = getSheetId(url);

  if (!id) {
    return reply.status(400).send({
      error: "Invalid url",
    });
  }
  const sheet = await googleSheet();
  try {
    const sheetName = await sheet.spreadsheets.get({
      spreadsheetId: id,
    });
    const name = sheetName.data.properties?.title || "Untitled Sheet";
    const { userId } = request.user;
    const accessKey = generateApiKey();

    const newForm = await prisma.form.create({
      data: {
        name,
        sheetId: id,
        sheetUrl: url,
        userId,
        accessKey,
      },
    });

    return {
      id: newForm.id,
      message: "Form created successfully",
    };
  } catch (error) {
    return reply.status(400).send({
      error: "You don't have access to this sheet",
    });
  }
};

export const getUserForms = async (
  request: FastifyRequest,
  _: FastifyReply
) => {
  const { userId } = request.user;
  // last 24 hours start and end using dayjs
  const start = dayjs().subtract(1, "day").startOf("day").toDate();
  const end = dayjs().subtract(1, "day").endOf("day").toDate();
  const forms = await prisma.form.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          submission: true,
        },
      },
      submission: {
        select: {
          id: true,
        },
        where: {
          createdAt: {
            gte: start.toISOString(),
            lte: end.toISOString(),
          },
        },
      },
    },
  });
  return forms;
};

export const getUserFormIntergation = async (
  request: FastifyRequest<GetSheetByID>,
  reply: FastifyReply
) => {
  try {
    const { formId } = request.params;
    const { userId, email } = request.user;
    const form = await prisma.form.findFirst({
      where: {
        id: formId,
        userId,
      },
    });

    if (!form) {
      return reply.status(404).send({
        message: "Form not found",
      });
    }
    // settings
    const settings = [
      {
        id: 1,
        label: "Email",
        description: `Send submission preview to your email (${email})`,
        value: form.sendEmail,
      },
    ];

    return settings;
  } catch (e) {
    return reply.status(500).send({
      error: "Something went wrong",
    });
  }
};
export const updateFormIntergation = async (
  request: FastifyRequest<SheetByIDUpdate>,
  reply: FastifyReply
) => {
  try {
    const { formId } = request.params;
    const { userId } = request.user;
    const body = request.body;
    const form = await prisma.form.findFirst({
      where: {
        id: formId,
        userId,
      },
    });

    if (!form) {
      return reply.status(404).send({
        message: "Form not found",
      });
    }

    if (body["id"] === "1") {
      await prisma.form.update({
        where: {
          id: formId,
        },
        data: {
          sendEmail: body["value"] as boolean,
        },
      });
    }

    return {
      message: "Settings updated successfully",
    };
  } catch (e) {
    return reply.status(500).send({
      error: "Something went wrong",
    });
  }
};
export const deleteForm = async (
  request: FastifyRequest<DeleteSheetForm>,
  reply: FastifyReply
) => {
  const { userId } = request.user;
  const { id } = request.params;

  const isFormExist = await prisma.form.findFirst({
    where: {
      userId,
      id,
    },
  });

  if (!isFormExist) {
    return reply.status(404).send({
      error: "Form not found",
    });
  }

  await prisma.form.delete({
    where: {
      id,
    },
  });

  return {
    message: "Form deleted successfully",
  };
};

export const getUserFormCode = async (
  request: FastifyRequest<GetSheetByID>,
  reply: FastifyReply
) => {
  try {
    const { formId } = request.params;
    const { userId } = request.user;
    const form = await prisma.form.findFirst({
      where: {
        id: formId,
        userId,
      },
    });

    if (!form) {
      return reply.status(404).send({
        message: "Form not found",
      });
    }
    const id = form.sheetId;
    const headers = await getSheetHeaders(id);

    const htmlCode = generateHTMLCode(form.publicId, headers);

    return [
      {
        id: 1,
        label: "HTML",
        description: "Embed this code in your website",
        value: htmlCode,
      },
    ];
  } catch (e) {
    return reply.status(500).send({
      error: "Something went wrong",
    });
  }
};

export const getUserFormSettings = async (
  request: FastifyRequest<GetSheetByID>,
  reply: FastifyReply
) => {
  const { formId } = request.params;
  const { userId } = request.user;
  const form = await prisma.form.findFirst({
    where: {
      id: formId,
      userId,
    },
  });

  if (!form) {
    return reply.status(404).send({
      message: "Form not found",
    });
  }

  const formSettings = [
    {
      id: 1,
      label: "Form Name",
      trigger: "name",
      type: "text",
      value: form.name,
      blur: false,
    },
    {
      id: 2,
      label: "Disable Submissions",
      trigger: "submissions",
      type: "switch",
      value: form.disabled,
      blur: false,
    },
    {
      id: 3,
      label: "Enable Public Access",
      trigger: "public",
      type: "switch",
      value: form.publicAccess,
      blur: false,
    },
  ];

  const formApiSettings = [
    {
      id: 4,
      label: "Public ID",
      trigger: "publicId",
      type: "copy",
      blur: !form.publicAccess,
      value: form.publicId,
    },
    {
      id: 5,
      label: "Public Access Key",
      trigger: "accessKey",
      type: "copy",
      blur: !form.publicAccess,
      value: form.accessKey,
    },
  ];

  const settings = {
    formSettings,
    formApiSettings,
    isPublic: form.publicAccess,
  };

  return settings;
};

export const updateFormSettings = async (
  request: FastifyRequest<SheetByIDUpdate>,
  reply: FastifyReply
) => {
  try {
    const { formId } = request.params;
    const { userId } = request.user;
    const body = request.body;
    const form = await prisma.form.findFirst({
      where: {
        id: formId,
        userId,
      },
    });

    if (!form) {
      return reply.status(404).send({
        message: "Form not found",
      });
    }
  } catch (e) {
    return reply.status(500).send({
      error: "Something went wrong",
    });
  }
};
