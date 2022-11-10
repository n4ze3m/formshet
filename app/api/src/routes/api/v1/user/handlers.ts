import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../../../utils/common";
import { Login, Register } from "./types";
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

	const user = await prisma.user.findUnique({
		where: {
			email,
		},
	});

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
	const {userId} = request.user;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    }
  })

  if(!user) {
    throw {
      status: 404,
      message: "User not found"
    }
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
    isAdmin: user.isAdmin
  }


  return payload;
};
