import { google, sheets_v4 } from "googleapis";


export const googleSheet = async () => {
    const auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_CRED_PATH,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })
    const client = await auth.getClient();
    const sheet = google.sheets({ version: "v4", auth: client });
    return sheet
}

export const getSheetId = (url: string) => {
    const regex = /https:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)\//
    const match = url.match(regex);
    if (!match) {
        return null
    }
    return match[1]
}