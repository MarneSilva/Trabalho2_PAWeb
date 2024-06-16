import { test, describe } from 'node:test';
import { equal, deepEqual } from 'node:assert';
import { build, options } from './app.js';

test('##Testing options configuration file', async (t) => {
    const app = await build(options);

    t.after(async () => {
        await app.close();
    });

    deepEqual(options.stage, 'dev');
    deepEqual(options.port, '3000');
    deepEqual(options.host, '127.0.0.1');
    deepEqual(options.jwt_secret, 'calendario123');
    deepEqual(options.db_url, 'mongodb://127.0.0.1:27017/calendario');
    deepEqual(options.ncrypt, 'somesecretkeyThisOne')
});

describe("##Suit to test /user(register/auth) API", async (t) => {
    test('#POST /register', async (t) => {
        const app = await build(options);

        t.after(async () => {
            await app.close();
        });
        const response = await app.inject({
            method: 'POST',
            url: '/register',
            body: {
                "_id": "1u",
                "username": "CarolineAndrade",
                "password": "Carolin2407",
                "isAdmin": true
            }
        });

        equal(response.statusCode, 201);
    });

    test('#POST /auth', async (t) => {
        const app = await build(options);

        t.after(async () => {
            await app.close();
        });
        const response = await app.inject({
            method: 'POST',
            url: '/auth',
            body: {
                "username": "CarolineAndrade",
                "password": "Carolin2407"
            }
        });

        equal(response.statusCode, 200);
    });

  describe("##Suit to test checkUser", async (t) => {
    test('# POST /register', async (t) => {
        const app = await build(options);

        t.after(async () => {
            await app.close();
        });
        const response = await app.inject({
            method: 'POST',
            url: '/register',
            body: {
                "_id": "2u",
                "username": "CarolineAndrade",
                "password": "asdasdas",
                "isAdmin": true
            }
        });

        equal(response.statusCode, 412);
    })
  })
})

describe("##Suit to test /calendar(token errors) API", async (t) => {

    test('#POST /calendar', async (t) => {
        const app = await build(options);

        t.after(async () => {
            await app.close();
        });
        const response = await app.inject({
            method: 'POST',
            url: '/calendar',
            body: {
                "_id": "1c",
                "eventName": "Encontro formal",
                "time": "12:30",
                "data": "19.04"
            },
            headers: {
                "isadmin": "true",
                "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkNhcm9saW5lQW5kcmFkZSIsImlhdCI6MTcxMzU1ODk2Mn0.zcSZPfffRABUbUbuknEHAiZEzFgYjHQqqdP1_FL8gPU"
            }
        });

        equal(response.statusCode, 201);
    });

    test('#GET /calendar', async (t) => {
        const app = await build(options);

        t.after(async () => {
            await app.close();
        });
        const response = await app.inject({
            method: 'GET',
            url: '/calendar'
        });

        equal(response.statusCode, 200);
    });

    test('#GET /calendar/1c', async (t) => {
        const app = await build(options);

        t.after(async () => {
            await app.close();
        });
        const response = await app.inject({
            method: 'GET',
            url: '/calendar/1c'
        });

        equal(response.statusCode, 200);
    });

    test('#PUT /calendar/1c', async (t) => {
        const app = await build(options);

        t.after(async () => {
            await app.close();
        });
        const response = await app.inject({
            method: 'PUT',
            url: '/calendar/1c',
            body: {
                "_id": "1c",
                "eventName": "Churrasco com os amigos",
                "time": "14:30",
                "data": "20.12"
            },
            headers: {
                "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkNhcm9saW5lQW5kcmFkZSIsImlhdCI6MTcxMzU1ODk2Mn0.zcSZPfffRABUbUbuknEHAiZEzFgYjHQqqdP1_FL8gPU",
                "isadmin": "true"
            }
        });

        equal(response.statusCode, 204);
    });

    describe("##Suit to test checkEvent", async (t) => {
        test('# POST /calendar', async (t) => {
            const app = await build(options);
    
            t.after(async () => {
                await app.close();
            });
            const response = await app.inject({
                method: 'POST',
                url: '/calendar',
                body: {
                    "_id": "2c",
                    "eventName": "Churrasco com os amigos",
                    "time": "17:12",
                    "data": "30.09"
                },
                headers: {
                    "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkNhcm9saW5lQW5kcmFkZSIsImlhdCI6MTcxMzU1ODk2Mn0.zcSZPfffRABUbUbuknEHAiZEzFgYjHQqqdP1_FL8gPU",
                    "isadmin": "true"
                }
            });
    
            equal(response.statusCode, 412);
        })
      });

      describe("##Suit to test token errors", async (t) => {
        test('# POST /calendar INVALID_TOKEN', async (t) => {
            const app = await build(options);
    
            t.after(async () => {
                await app.close();
            });
            const response = await app.inject({
                method: 'POST',
                url: '/calendar',
                body: {
                    "_id": "3c",
                    "eventName": "Aniversario do namorado",
                    "time": "20:02",
                    "data": "10.01"
                },
                headers: {
                    "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkNhcm9saW5lQW5kcmFkZSIsImlhdCI6MTcxMzU1ODk2Mn0.zcSZPfffRABUbUbuknEHAiZE",
                    "isadmin": "true"
                }
            });
    
            equal(response.statusCode, 401);
        })
    
        test('# POST /calendar NO_TOKEN', async (t) => {
            const app = await build(options);
    
            t.after(async () => {
                await app.close();
            });
            const response = await app.inject({
                method: 'POST',
                url: '/calendar',
                body: {
                    "_id": "2c",
                    "eventName": "Conferencia executiva",
                    "time": "18:12",
                    "data": "21.04"
                },
                headers: {
                    "isadmin": "true"
                }
            });
    
            equal(response.statusCode, 401);
        })
    
        test('# POST /calendar UNAUTHORIZED_PERSONNEL', async (t) => {
            const app = await build(options);
    
            t.after(async () => {
                await app.close();
            });
            const response = await app.inject({
                method: 'POST',
                url: '/calendar',
                body: {
                    "_id": "2c",
                    "eventName": "Videoconferencia",
                    "time": "18:22",
                    "data": "12.09"
                },
                headers: {
                    "isadmin": "false",
                    "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1hcm5lIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTcxMzE4NDI5Mn0.3M0RSpjVOJYbnlt8ZgDq-I0a_Gx2jN2K6QEvNEPxXXI"
                 }
            });
    
            deepEqual(response.statusCode, 401);
        })
      });
});

describe("##Suit to test /data API", async (t) => {

    test('#GET /data', async (t) => {
        const app = await build(options);

        t.after(async () => {
            await app.close();
        });
        const response = await app.inject({
            method: 'GET',
            url: '/data'
        });

        equal(response.statusCode, 200);
    });

    test('#GET /data/19.04/events', async (t) => {
        const app = await build(options);

        t.after(async () => {
            await app.close();
        });
        const response = await app.inject({
            method: 'GET',
            url: '/data/19.04/events'
        });

        equal(response.statusCode, 200);
    });   

});

describe("##Suit to test errors", async (t) => {

    test('# GET /error', async (t) => {
        const app = await build(options);

        t.after(async () => {
            await app.close();
        });
        const response = await app.inject({
            method: 'GET',
            url: '/error'
        });

        equal(response.statusCode, 500);
    })

    test('# GET /notfound', async (t) => {
        const app = await build(options);

        t.after(async () => {
            await app.close();
        });
        const response = await app.inject({
            method: 'GET',
            url: '/notfound'
        });

        equal(response.statusCode, 404);
    })

    test('# POST /auth UNAUTHORIZED_CREDENTIALS', async (t) => {
        const app = await build(options);

        t.after(async () => {
            await app.close();
        });
        const response = await app.inject({
            method: 'POST',
            url: '/auth',
            body: {
                "username": "CarolineAndrade",
                "password": "Carolin"
            }
        });

        equal(response.statusCode, 401);
    })

    test('# POST /calendar UNAUTHORIZED_PERSONNEL', async (t) => {
        const app = await build(options);

        t.after(async () => {
            await app.close();
        });
        const response = await app.inject({
            method: 'POST',
            url: '/calendar',
            body: {
                "_id": "4c",
                "eventName": "Reuniao de imprensa",
                "time": "21:43",
                "data": "27.02"
            },
            headers: {
                "isadmin": "false",
                "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkNhcm9saW5lQW5kcmFkZSIsImlhdCI6MTcxMzU1ODk2Mn0.zcSZPfffRABUbUbuknEHAiZEzFgYjHQqqdP1_FL8gPU"
            }
        });

        equal(response.statusCode, 401);
    })

});

describe('##Suits to test DELETE ', async(t) => { 
    test('# DELETE /calendar/1c', async (t) => {
        const app = await build(options);

        t.after(async () => {
            await app.close();
        });
        const response = await app.inject({
            method: 'DELETE',
            url: '/calendar/1c',
            headers: {
                "isadmin": "true",
                "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkNhcm9saW5lQW5kcmFkZSIsImlhdCI6MTcxMzU1ODk2Mn0.zcSZPfffRABUbUbuknEHAiZEzFgYjHQqqdP1_FL8gPU"
            }
        });

        equal(response.statusCode, 204);
    });

 });