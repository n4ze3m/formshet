import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../../../utils/common";
import { convertToArrayOfObject, convertToArrayOfRow } from "../../../../utils/digest";
import { getSheetId, googleSheet } from "../../../../utils/sheet";
import { CreateSheet, DeleteSheetForm, GetSheetByID, SubmitSheetForm, VerifySheet } from "./types";


// formshit@ivisit-283003.iam.gserviceaccount.com

export const getSheetById = async (request: FastifyRequest<GetSheetByID>, reply: FastifyReply) => {
    // get id from param
    const { formId } = request.params;
    const { userId } = request.user;
    const sheet = await googleSheet()

    const form = await prisma.form.findFirst({
        where: {
            id: formId,
            userId
        }
    })

    if (!form) {
        return reply.status(404).send({
            message: "Form not found"
        })
    }

    const id = form.sheetId

    try {
        // get column names
        const columnNames = await sheet.spreadsheets.values.get({
            spreadsheetId: id,
            range: "A1:Z1"
        })
        // get rows of data
        const rows = await sheet.spreadsheets.values.get({
            spreadsheetId: id,
            range: "A2:Z"
        })

        const data = convertToArrayOfObject(columnNames.data.values || [], rows.data.values || []);

        return {
            data: {
                header: columnNames.data.values || [],
                rows: data
            },
            form
        }
    } catch (e) {
        return reply.status(500).send({
            message: "Something went wrong"
        })
    }

}

export const submitSheetForm = async (request: FastifyRequest<SubmitSheetForm>, reply: FastifyReply) => {
    // get params
    const { id } = request.params;
    const supportedTypes = ["application/x-www-form-urlencoded", "application/json"]
    let data: {}
    if (!supportedTypes.includes(request.headers["content-type"])) {
        return reply.status(400).send({
            message: "Invalid content type"
        })
    }
    data = request.body
    // if no data or data is empty
    if (!data || Object.keys(data).length === 0) {
        reply.status(400).send({
            error: "No data provided"
        })
    }
    const sheet = await googleSheet()
    // get column names
    const columnNames = await sheet.spreadsheets.values.get({
        spreadsheetId: id,
        range: "A1:Z1"
    })

    const row = convertToArrayOfRow(columnNames.data.values || [], data);
    // append row
    await sheet.spreadsheets.values.append({
        spreadsheetId: id,
        range: "A2:Z",
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values: [row]
        }
    })

    return {
        message: "Thanks for submitting the form"
    }
}

export const verifySheet = async (request: FastifyRequest<VerifySheet>, reply: FastifyReply) => {
    const { url } = request.body || {}

    if (!url) {
        return reply.status(400).send({
            error: "No url provided"
        })
    }
    const id = getSheetId(url)
    if (!id) {
        return reply.status(400).send({
            error: "Invalid url"
        })
    }
    const sheet = await googleSheet()
    // get sheet name 
    try {
        const sheetName = await sheet.spreadsheets.get({
            spreadsheetId: id
        })

        return {
            name: sheetName.data.properties?.title,
            id
        }
    } catch (error) {
        return reply.status(400).send({
            error: "You don't have access to this sheet"
        })
    }

}


export const createSheet = async (request: FastifyRequest<CreateSheet>, reply: FastifyReply) => {
    const { url } = request.body || {}

    if (!url) {
        return reply.status(400).send({
            error: "No url provided"
        })
    }
    const id = getSheetId(url)

    if (!id) {
        return reply.status(400).send({
            error: "Invalid url"
        })
    }
    const sheet = await googleSheet()
    try {
        const sheetName = await sheet.spreadsheets.get({
            spreadsheetId: id
        })
        const name = sheetName.data.properties?.title || "Untitled Sheet"
        const { userId } = request.user

        const newForm = await prisma.form.create({
            data: {
                name,
                sheetId: id,
                sheetUrl: url,
                userId,
            }
        })

        return {
            id: newForm.id,
            message: "Form created successfully"
        }
    } catch (error) {
        return reply.status(400).send({
            error: "You don't have access to this sheet"
        })
    }
}

export const getUserForms = async (request: FastifyRequest, reply: FastifyReply) => {
    const { userId } = request.user
    const forms = await prisma.form.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    return forms
}

export const deleteForm = async (request: FastifyRequest<DeleteSheetForm>, reply: FastifyReply) => {
    const { userId } = request.user
    const { id } = request.params

    const isFormExist = await prisma.form.findFirst({
        where: {
            userId,
            id
        }
    })

    if (!isFormExist) {
        return reply.status(404).send({
            error: "Form not found"
        })
    }

    await prisma.form.delete({
        where: {
            id
        }
    })

    return {
        message: "Form deleted successfully"
    }
}