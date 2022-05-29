const app = require('../app/app')

const request = require('supertest');

let token: any;



// beforeAll((done) => {
// request('localhost:3060')
//     .post('/api/user/login')
//     .set('Accept', 'application/json')
//     .send({
//         name: 'irfan',
//         password: 'irfan',
//     }).end((err: any, response: { body: { token: any; }; }) => {
//         console.log(response);

//         token = response.body.token; // save the token!
//      done()
//     });
    
    
       
// });

// describe('Register user', () => {
//     test('Should sign up a user',  () => {
//         return request(app).post('/api/user/register')
//             .send({
//                 name: 'test',
//                 password: 'test'
//             })
//             .set('Accept', 'application/json')
//             .expect(201)
//     })
// })
describe('GET /findUser', () => {
    // token not being sent - should respond with a 404
    test('It should require authorization', () => {
        return request(app)
            .get('/api/user/findUser').send({ name: "adedayo" })
            .set('Accept', 'application/json')
            .then((response: { statusCode: any; }) => {
                expect(response.statusCode).toBe(401);
            });
    });
    // console.log(token);

//     test('It should require authorization', async() => {
//         await request(app)
//            .get('/api/product/getAllProduct')
//            .set('Accept', 'application/json')
//            .then((response: { statusCode: any; }) => {
//                console.log(response);
               
//                expect(response.statusCode).toBe(201);
//            });

       
//    });
    // test('It should require authorization', async() => {
    //      await request(app)
    //         .post('/api/user/login').send({ name: "irf", password:'irfan' })
    //         .set('Accept', 'application/json')
    //         .then((response: { statusCode: any; }) => {
    //             console.log(response);
                
    //             expect(response.statusCode).toBe(401);
    //         });

        
    // });
    // send the token - should respond with a 200
    // test('It responds with JSON', () => {
    //     return request(app)
    //         .get('/api/user/findUser').send({ name: "irfan" })
    //         .set('Accept', 'application/json')
    //         .set('Authorization', `Bearer ${token}`)
    //         .then((response: { statusCode: any; type: any; }) => {


    //             expect(response.statusCode).toBe(200);
    //             expect(response.type).toBe('application/json');
    //         });
    // });
});