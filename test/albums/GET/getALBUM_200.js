
describe('@get', function () {

    //Using assert method
    it('should return a 200 OK status code for Album ID 1', function (done) {
        utils.httpGET('/albums/1', {})
            .set('content-type', 'application/json; charset=utf-8')
            .expect(function (res) {
                const response = res.body;
                //console.log(response);
                return assert.deepEqual(response,
                    {
                        "userId": 1,
                        "id": 1,
                        "title": "quidem molestiae enim"
                    })

            })
            .expect(200, done);
    });

    //Using expect method to GET Album ID 1
    it('should return a 200 OK status code for Album ID 1 using expect method', function (done) {
        utils.httpGET('/albums/1', {})
            .set('content-type', 'application/json; charset=utf-8')
            .expect(function (res) {
                 const response = res.body;
                // console.log(response);
                expect(response).to.have.property('userId');
                expect(response).to.have.property('id');
                expect(response).to.have.property('title');
                expect(response.id).to.equal(1);
                expect(response.userId).to.equal(1);
                expect(response.title).to.equal('quidem molestiae enim');


            })
            .expect(200, done);
    });

});