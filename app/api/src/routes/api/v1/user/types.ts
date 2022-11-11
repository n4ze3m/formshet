export interface Login {
	Body: { email: string; password: string };
}

export interface Register {
	Body: { email: string; password: string; name: string };
}

export interface SettingsUpdates {
	Body: { [key: string]: string | boolean | number };
}

export interface UpdatePassword {
	Body: {
		currentPassword: string;
		newPassword: string;
		confPassword: string;
	};
}
