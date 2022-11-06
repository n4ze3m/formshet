export interface VerifySheet {
	Body: { url: string }
}

export interface CreateSheet {
	Body: { url: string }
}


export interface GetSheetByID {
	Params: {formId: string }
}
export interface SheetByIDUpdate {
	Params: {formId: string },
	Body: { [key: string]: string | boolean | number }
}
export interface SubmitSheetForm {
	Params: { id: string },
	Body: { [key: string]: string }
}

export interface DeleteSheetForm {
	Params: { id: string }
}