describe('200 DELETE /posts/101', function () {

     it('should return a 200 code after deleting fake postId 100', function () {
         utils.httpDELETE('/posts/101', {})
            .send(
                {
                    id: 101,
                    title: 'foo',
                    body: 'bar',
                    userId: 1
                }
            )
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (res) {
                const response = res.body;
                console.log(response)
                return assert.deepEqual(response,
                    {} //return empty response
                );
            })
             .expect(200);

     });


});