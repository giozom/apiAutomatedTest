describe('@get', function () {

    //Using assert method
    it('should return a 200 OK status code for PostID 1', function (done) {
        utils.httpGET('/posts/1', {})
            .set('content-type', 'application/json; charset=utf-8')
            .expect(function (res) {
                const response = res.body;
                //console.log(response);
                return assert.deepEqual(response,
                    {
                        "id": "1",
                        "title": "foo",
                        "body": "bar",
                        "userId": 1
                    })

            })
            .expect(200, done);
    });

    //Using expect method
    it('should return a 200 OK status code for PostID 1 using expect method', function (done) {
        utils.httpGET('/posts/1', {})
            .set('content-type', 'application/json; charset=utf-8')
            .expect(function (res) {
                const response = res.body;
                //console.log(response);
                expect(response).to.have.property('id');
                expect(response).to.have.property('title');
                expect(response).to.have.property('body');
                expect(response).to.have.property('userId');
                expect(response.id).to.equal('1');
            })
            .expect(200, done);
    });


});