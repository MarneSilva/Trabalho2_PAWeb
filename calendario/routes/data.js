export default async function calendar(app, options) {
    const events = app.mongo.db.collection('eventos');
    const data = app.mongo.db.collection('datas')

    app.get('/data', 
        {
            config: {
                logMe: true
            }
        }, 
        async (request, reply) => {
            return await data.find().toArray();
        }
    );

    app.get('/data/:data/events', 
        {
            config: {
                logMe: true
            }
        },
        async (request, reply) => {
            let wantedObject = await data.findOne({data: request.params.data})
            let requestData = wantedObject.data
            return await events.find({data: requestData}).toArray()
        }
    );
}