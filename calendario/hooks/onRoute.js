/** @type{import('fastify').FastifyPluginAsync<>} */
import { extractUser, logMe, checkUser, checkEvent, userIsAdmin } from './functions/index.js';


export default async function onRouteHook(app, options) {
    app.addHook('onRoute', (routeOptions) => {
        if(routeOptions.onRequest && !Array.isArray(routeOptions.onRequest)){
            routeOptions.onRequest = [routeOptions.onRequest];
        }else{
            routeOptions.onRequest = [];
        }
        if(routeOptions.preHandler && !Array.isArray(routeOptions.preHandler)){
            routeOptions.preHandler = [routeOptions.preHandler];
        }else{
            routeOptions.preHandler = [];
        }
        if(routeOptions.config?.logMe){
            routeOptions.onRequest.push(logMe(app))
        }
        if(routeOptions.config?.requireAuthentication){
            routeOptions.onRequest.push(extractUser(app))
        }
        if(routeOptions.config?.checkAdmin){
            routeOptions.onRequest.push(userIsAdmin(app))
        }
        if(routeOptions.url === '/register' && routeOptions.method === 'POST'){
            routeOptions.preHandler.push(checkUser(app));
        }
        if(routeOptions.url === '/calendar' && routeOptions.method === 'POST'){
            routeOptions.preHandler.push(checkEvent(app));
        }
    });
}