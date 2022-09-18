import { FastifyReply, FastifyRequest } from "fastify";
import { convertToArrayOfObject, convertToArrayOfRow } from "../../../../utils/digest";
import { googleSheet } from "../../../../utils/sheet";
import { VerifySheet } from "./types";


// formshit@ivisit-283003.iam.gserviceaccount.com

export const getSheetById = async (request: FastifyRequest, _: FastifyReply) => {
    // get id from param
    const { id } = request.params as any;

    const sheet = await googleSheet()

    // get column names
    const columnNames = await sheet.spreadsheets.values.get({
        spreadsheetId: id,
        range: "A1:Z1"
    })
    // get rows         bnv
    const rows = await sheet.spreadsheets.values.get({
        spreadsheetId: id,
        range: "A2:Z"
    })

    const data = convertToArrayOfObject(columnNames.data.values || [], rows.data.values || []);

    return {
        data
    }
}

export const submitSheetForm = async (request: FastifyRequest, reply: FastifyReply) => {
    // get params
    const { id } = request.params as any;
    const supportedTypes = ["application/x-www-form-urlencoded", "application/json"]
    let data: {}
    if (!supportedTypes.includes(request.headers["content-type"])) {
        return reply.status(400).send({
            message: "Invalid content type"
        })
    }
    data = request.body as any
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
    // get id from url using regex
    const regex = /https:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)\//
    const match = url.match(regex);
    if (!match) {
        return reply.status(400).send({
            error: "Invalid url"
        })
    }
    const id = match[1]
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