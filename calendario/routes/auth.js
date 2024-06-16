/** @type{import('fastify').FastifyPluginAsync<>} */
import { UNATHORIZED_CREDENTIALS } from '../libs/errors.js';
import ncrypt from 'ncrypt-js';
import dotenv from 'dotenv';
dotenv.config();
var ncryptObject = new ncrypt(process.env.NCRYPT)

export default async function auth(app, options) {
    const users = app.mongo.db.collection('users');
    app.post('/auth', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    username: { type: 'string' },
                    password: { type: 'string' }
                },
                required: ['username', 'password']
            }
        }
    }, async (request, reply) => {
        
        let user = request.body;
        request.log.info(`Login for user ${user.username}`);
        let searchedUser = await users.findOne({name: user.username})
        let decrpytedPassword = ncryptObject.decrypt(searchedUser.password)
        if(decrpytedPassword != user.password) {
            throw new UNATHORIZED_CREDENTIALS()
        }
        delete user.password;
        return {
            'x-access-token' : app.jwt.sign(user)
        }
    });
}