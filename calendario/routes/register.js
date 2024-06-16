/** @type{import('fastify').FastifyPluginAsync<>} */
import ncrypt from 'ncrypt-js';
import dotenv from 'dotenv';
dotenv.config();
var ncryptObject = new ncrypt(process.env.NCRYPT)



export default async function register(app, options) {
    const users = app.mongo.db.collection('users');

    app.post('/register', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    username: { type: 'string' },
                    password: { type: 'string' },
                    isAdmin: { type: 'boolean' }
                },
                required: ['username', 'password', 'isAdmin']
            }
        },
        config: {
            requireAuthentication: false
        }
    }, async (request, reply) => {
        let user = request.body;
        let encryptedPassword = ncryptObject.encrypt(user.password)
        let newUser = {
            "_id": user._id,
            "name": user.username,
            "password": encryptedPassword,
            "isAdmin": user.isAdmin
        }
        await users.insertOne(newUser)
        return reply.code(201).send()
    });

    
}