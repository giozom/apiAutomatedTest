describe('@get', function () {

    //Using assert method
    it('should return a 200 OK status code for User ID 1', function (done) {
        utils.httpGET('/users/1', {})
            .set('content-type', 'application/json; charset=utf-8')
            .expect(function (res) {
                const response = res.body;
                //console.log(response);
                return assert.deepEqual(response,
                    {
                        "id": 1,
                        "name": "Leanne Graham",
                        "username": "Bret",
                        "email": "Sincere@april.biz",
                        "address": {
                            "street": "Kulas Light",
                            "suite": "Apt. 556",
                            "city": "Gwenborough",
                            "zipcode": "92998-3874",
                            "geo": {
                                "lat": "-37.3159",
                                "lng": "81.1496"
                            }
                        },
                        "phone": "1-770-736-8031 x56442",
                        "website": "hildegard.org",
                        "company": {
                            "name": "Romaguera-Crona",
                            "catchPhrase": "Multi-layered client-server neural-net",
                            "bs": "harness real-time e-markets"
                        }
                    })

            })
            .expect(200, done);
    });

    //Using expect method to GET user ID 1
    it('should return a 200 OK status code for userId 1 using expect method', function (done) {
        utils.httpGET('/users/1', {})
            .set('content-type', 'application/json; charset=utf-8')
            .expect(function (res) {
                const response = res.body;
                //console.log(response);
                expect(response).to.have.property('id');
                expect(response).to.have.property('name');
                expect(response).to.have.property('username');
                expect(response).to.have.property('email');
                expect(response.id).to.equal(1);
                expect(response.email).to.equal('Sincere@april.biz');
                expect(response.address.city).to.equal('Gwenborough');


            })
            .expect(200, done);
    });

});