import { FastifyReply, FastifyRequest } from "fastify";
import { convertToArrayOfObject, convertToArrayOfRow } from "../../../../utils/digest";
import { googleSheet } from "../../../../utils/sheet";


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
    // get rows
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
    // get form data or body
    const data = request.body as any;
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