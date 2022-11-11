import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../../../utils/common";
import { Login, Register, SettingsUpdates, UpdatePassword } from "./types";
import bcrypt from "bcryptjs";

export const userLogin = async (
	request: FastifyRequest<Login>,
	_: FastifyReply,
) => {
	const { email, password } = request.body || {};

	if (!(email && password)) {
		throw {
			status: 500,
			message: "Email or password is missing",
		};
	}

	const user = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	if (!user) {
		throw {
			status: 500,
			message: "Invalid email or password",
		};
	}

	const passwordMatch = await bcrypt.compare(password, user.password);

	if (!passwordMatch) {
		throw {
			status: 500,
			message: "Wrong password or email address.",
		};
	}

	const payload = {
		userId: user.id,
		email: user.email,
		name: user.name,
	};

	return payload;
};

export const userRegister = async (
	request: FastifyRequest<Register>,
	_: FastifyReply,
) => {
	const { email, password, name } = request.body || {};
	if (!(email && password && name)) {
		throw {
			status: 500,
			message: "Name, email or password is missing",
		};
	}

	const isRegisterationAllowed = await prisma.applicationSetting.findFirst({
		where: {
			disableReg: true,
		},
	});

	if (isRegisterationAllowed) {
		throw {
			status: 403,
			message: "Registeration is currently disabled by the admin.",
		};
	}

	const user = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	const userCounts = await prisma.user.count();
	const maxUsers = await prisma.applicationSetting.findFirst({
		where: {
			maxUsers: {
				gte: userCounts + 1,
			},
		},
	});

	if (!maxUsers) {
		throw {
			status: 403,
			message: "Maximum users registeration reached. Please contact the admin.",
		};
	}

	if (user) {
		throw {
			status: 500,
			message: "Email already exists",
		};
	}

	const hashedPassword = await bcrypt.hash(password, 12);

	const newUser = await prisma.user.create({
		data: {
			email,
			password: hashedPassword,
			name,
		},
	});

	const userCount = await prisma.user.count();
	if (userCount === 1) {
		// this is the first user, make them an admin
		await prisma.user.update({
			where: {
				id: newUser.id,
			},
			data: {
				isAdmin: true,
				role: "ADMIN",
			},
		});
		// generate settings
		await prisma.applicationSetting.create({
			data: {},
		});
	}

	const payload = {
		userId: newUser.id,
		email: newUser.email,
		name: newUser.name,
	};

	return payload;
};

export const userSettings = async (
	request: FastifyRequest,
	_: FastifyReply,
) => {
	const { userId } = request.user;

	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
	});

	if (!user) {
		throw {
			status: 404,
			message: "User not found",
		};
	}

	const settings = await prisma.applicationSetting.findFirst({});
	// this setting is required for the frontend to work
	if (!settings) {
		throw {
			status: 404,
			message: "Settings not found",
		};
	}

	const profileBlock = [
		{
			id: 1,
			label: "Name",
			value: user.name,
			type: "input",
		},
		{
			id: 2,
			label: "Email",
			value: user.email,
			type: "input",
		},
	];

	const adminBlock = [
		{
			id: 3,
			label: "Disable Registration",
			value: settings.disableReg,
			type: "switch",
		},
		{
			id: 4,
			label: "Maxiumum Users",
			value: settings.maxUsers,
			type: "input",
		},
	];

	const payload = {
		profileBlock,
		adminBlock: user.isAdmin ? adminBlock : [],
		isAdmin: user.isAdmin,
	};

	return payload;
};

export const updateUserProfileSettings = async (
	request: FastifyRequest<SettingsUpdates>,
	_: FastifyReply,
) => {
	const { userId } = request.user;
	const body = request.body || {};

	Object.keys(body).forEach(async (key) => {
		switch (key) {
			case "1": {
				await prisma.user.update({
					where: {
						id: userId,
					},
					data: {
						name: body[key] as string,
					},
				});
				break;
			}
			case "2": {
				const isEmailTaken = await prisma.user.findFirst({
					where: {
						id: {
							not: userId,
						},
						email: body[key] as string,
					},
				});
				if (isEmailTaken) {
					throw {
						status: 400,
						message: "Email already taken",
					};
				}

				await prisma.user.update({
					where: {
						id: userId,
					},
					data: {
						email: body[key] as string,
					},
				});
				break;
			}
		}
	});

	return {
		message: "Settings updated",
	};
};

export const updateUserAdminSettings = async (
	request: FastifyRequest<SettingsUpdates>,
	_: FastifyReply,
) => {
	const { userId } = request.user;

	const isUserAdmin = await prisma.user.findFirst({
		where: {
			id: userId,
			isAdmin: true,
		},
	});

	if (!isUserAdmin) {
		throw {
			status: 403,
			message: "Not authorized",
		};
	}

	const body = request.body || {};

	Object.keys(body).forEach(async (key) => {
		switch (key) {
			case "3": {
				await prisma.applicationSetting.updateMany({
					data: {
						disableReg: body[key] as boolean,
					},
				});
				break;
			}
			case "4": {
				await prisma.applicationSetting.updateMany({
					data: {
						maxUsers: parseInt(body[key] as string, 10),
					},
				});
				break;
			}
		}
	});

	return {
		message: "Settings updated",
	};
};

export const updateUserPassword = async (
	request: FastifyRequest<UpdatePassword>,
	_: FastifyReply,
) => {
	const { userId } = request.user;
	const { currentPassword, newPassword, confPassword } = request.body;

	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
	});

	if (!user) {
		throw {
			status: 404,
			message: "User not found",
		};
	}
	if (newPassword !== confPassword) {
		throw {
			status: 400,
			message: "Passwords do not match",
		};
	}
	const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

	if (!isPasswordValid) {
		throw {
			status: 400,
			message: "Invalid password",
		};
	}

	const hashedPassword = await bcrypt.hash(newPassword, 12);

	await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			password: hashedPassword,
		},
	});

	return {
		message: "Password updated",
	};
};
