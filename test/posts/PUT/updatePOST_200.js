describe('200 PUT /posts/1', function () {

     it.only('should return a 200 code after updating postId 1', function (done) {
         utils.httpPUT('/posts/1', {})
            .send({id: 1, title: 'sodalicious juicy', body: 'candy crush', userId: 1})
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (res) {
                const response = res.body;
                console.log(response);
                return assert.deepEqual(response,
                    {
                        id: 1,
                        title: 'sodalicious juicy',
                        body: 'candy crush',
                        userId: 1
                    }
                );
            })
             .expect(200, done);

     });


});