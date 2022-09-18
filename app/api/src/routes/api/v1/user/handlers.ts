import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../../../utils/common";
import { Login, Register } from "./types";
import bcrypt from "bcryptjs";

export const userLogin = async (request: FastifyRequest<Login>, _: FastifyReply) => {
    const { email, password } = request.body || {};

    if (!email || !password) {
        throw {
            status: 500,
            message: "Email or password is missing",
        };
    }

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!user) {
        throw {
            status: 500,
            message: "Invalid email or password"
        };
    }


    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );

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
    }

    
    return payload;
}


export const userRegister = async (request: FastifyRequest<Register>, _: FastifyReply) => {
    const { email, password, name } = request.body || {};
    if (!email || !password || !name) {
        throw {
            status: 500,
            message: "Name, email or password is missing",
        };
    }

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if(user) {
        throw {
            status: 500,
            message: "Email already exists"
        };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name
        }
    })

    const payload = {
        userId: newUser.id,
        email: newUser.email,
        name: newUser.name,
    }

    return payload;
}