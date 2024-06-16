import { ALREADY_EXISTS } from "../../../libs/errors.js";
export const checkEvent = (app) => async (request, reply) => {
    const events = app.mongo.db.collection('eventos')
    let event = request.body;
    let result = await events.count({eventName: event.eventName})

    if(result > 0) throw new ALREADY_EXISTS();
}