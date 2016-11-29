describe('@put', function () {

     it('should return a 200 code after updating postId 1', function (done) {
        utils.httpPUT('/posts/20', {})
            .send(
                {
                    id: 20,
                    title: 'candy crush',
                    body: 'sodalicious juicy',
                    userId: 1
                }
            )
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (res) {
                const response = res.body;
                console.log(response);
                expect(response.id).to.equal('20');
                expect(response.title).to.equal('candy crush');
                expect(response.body).to.equal('sodalicious juicy');
                expect(response.userId).to.equal(1);

            })
            .expect(200, done);

    });

    it('should return a 200 code after updating postId 1', function (done) {
        utils.httpPUT('/posts/1', {})
            .send(
                {
                    id: 1,
                    title: 'foo',
                    body: 'bar',
                    userId: 1
                }
            )
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (res) {
                const response = res.body;
                console.log(response);
                expect(response.id).to.equal('1');
                expect(response.title).to.equal('foo');
                expect(response.body).to.equal('bar');
                expect(response.userId).to.equal(1);

            })
            .expect(200, done);

    });


});