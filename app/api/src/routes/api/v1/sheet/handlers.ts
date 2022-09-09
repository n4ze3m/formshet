import { FastifyReply, FastifyRequest } from "fastify";
import { google } from "googleapis";
import { convertToArrayOfObject } from "../../../../utils/digest";


// formshit@ivisit-283003.iam.gserviceaccount.com

export const getSheetById = async (request: FastifyRequest, _: FastifyReply) => {
    // get id from param
    const { id } = request.params as any;

    const auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_CRED_PATH,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })
    const client = await auth.getClient();

    const googleSheets = google.sheets({ version: "v4", auth: client });

    // get column names
    const columnNames = await googleSheets.spreadsheets.values.get({
        spreadsheetId: id,
        range: "A1:Z1"
    })
    // get rows
    const rows = await googleSheets.spreadsheets.values.get({
        spreadsheetId: id,
        range: "A2:Z"
    })

    const data = convertToArrayOfObject(columnNames.data.values || [], rows.data.values || []);

    return {
        data
    }
}
