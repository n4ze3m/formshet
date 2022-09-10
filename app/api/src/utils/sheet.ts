import { google } from "googleapis";


export const googleSheet = async () => {
    const auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_CRED_PATH,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })
    const client = await auth.getClient();
    const sheet = google.sheets({ version: "v4", auth: client });
    return sheet
}