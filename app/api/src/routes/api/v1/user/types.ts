export interface Login {
	Body: { email: string, password: string}
}

export  interface Register {
	Body: { email: string, password: string, name: string}
}