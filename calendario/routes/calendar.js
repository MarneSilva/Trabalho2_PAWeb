export default async function calendar(app, options) {
    const events = app.mongo.db.collection('eventos');
    const data = app.mongo.db.collection('datas')

    app.get('/calendar',
        {
            config: {
                logMe: true
            }
        },
        async (request, reply) => {
            return await events.find().toArray()
        }
    );

    app.post('/calendar', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    eventName: { type: 'string' },
                    data: { type: 'string' },
                    time: { type: 'string' },
                    description: { type: 'string' }
                },
                required: ['_id', 'eventName', 'data', 'time']
            }
        },
        config: {
            requireAuthentication: true,
            checkAdmin: true
        }
    }, async (request, reply) => {
        let thisEvent = request.body;
        let dataData = {
            "_id": thisEvent._id,
            "data": thisEvent.data,
            "time": thisEvent.time
        }
        await events.insertOne(thisEvent)
        await data.insertOne(dataData)
        return reply.code(201).send()
    });

    app.put('/calendar/:_id', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    eventName: { type: 'string' },
                    data: { type: 'string' },
                    time: { type: 'string' },
                    description: { type: 'string' }
                },
                required: ['_id', 'eventName', 'data', 'time']
            }
        },
        config: {
            requireAuthentication: true,
            checkAdmin: true
        }
    }, async (request, reply) => {
        let id = request.params._id
        let putEvent = request.body;
        await events.updateOne({ _id: id }, {
            $set: {
                _id: putEvent._id,
                eventName: putEvent.eventName,
                data: putEvent.data,
                time: putEvent.time,
                description: putEvent.description
            }
        });
        await data.updateOne({ _id: id }, {
            $set: {
                _id: putEvent._id,
                data: putEvent.data,
                time: putEvent.time
            }
        })
        return reply.code(204).send()
    });

    app.delete('/calendar/:_id', {
        config: {
            requireAuthentication: true,
            checkAdmin: true
        }
    }, async (request, reply) => {
        let id = request.params._id;
        await events.deleteOne({ _id: id })
        await data.deleteOne({ _id: id })
        return reply.code(204).send()
    });
}