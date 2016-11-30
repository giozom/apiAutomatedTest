
describe('@get', function () {

    //Using assert method
    it('should return a 200 OK status code for Comment ID 1', function (done) {
        utils.httpGET('/comments/1', {})
            .set('content-type', 'application/json; charset=utf-8')
            .expect(function (res) {
                const response = res.body;
                //console.log(response);
                return assert.deepEqual(response,
                    {
                        "postId": 1,
                        "id": 1,
                        "name": "id labore ex et quam laborum",
                        "email": "Eliseo@gardner.biz",
                        "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium"
                    })

            })
            .expect(200, done);
    });

    //Using expect method to GET comment ID 1
    it('should return a 200 OK status code for comment ID 1 using expect method', function (done) {
        utils.httpGET('/comments/1', {})
            .set('content-type', 'application/json; charset=utf-8')
            .expect(function (res) {
                const response = res.body;
                //console.log(response);
                expect(response).to.have.property('postId');
                expect(response).to.have.property('id');
                expect(response).to.have.property('name');
                expect(response).to.have.property('email');
                expect(response).to.have.property('body');
                expect(response.id).to.equal(1);
                expect(response.email).to.equal('Eliseo@gardner.biz');
                expect(response.name).to.equal('id labore ex et quam laborum');


            })
            .expect(200, done);
    });


});