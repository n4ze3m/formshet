import fp from 'fastify-plugin'
import fastifyJwt, { FastifyJWTOptions } from '@fastify/jwt'

declare module "@fastify/jwt" {
    interface FastifyJWT {
        user: {
            userId: string,
            email: string,
            name: string,
        }
    }
}

export default fp<FastifyJWTOptions>(async (fastify, opts) => {
    fastify.register(fastifyJwt, {
        secret: fastify.config.FORMSHET_SECRET_KEY,
        sign: {
            expiresIn: '7d'
        }
    })

    fastify.decorate("authenticate", async function (request, reply) {
        try {
            await request.jwtVerify()
        } catch (err) {
            reply.send(err)
        }
    })
})

declare module 'fastify' {
    export interface FastifyInstance {
        authenticate(): Promise<void>
    }
}