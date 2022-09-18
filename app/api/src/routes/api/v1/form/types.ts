export interface VerifySheet {
	Body: { url: string }
}

export interface CreateSheet {
	Body: { url: string }
}


export interface GetSheetByID {
	Params: {formId: string }
}

export interface SubmitSheetForm {
	Params: { id: string },
	Body: { [key: string]: string }
}