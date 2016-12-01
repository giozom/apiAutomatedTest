
describe('@post', function () {

    it('should return a 201 code after posting', function (done) {
        utils.httpPOST('/posts', {})
            .send({title: 'foo', body: 'bar', userId: 1})
            .set('content-type', 'application/json; charset=utf-8')
            .expect(function (res) {
                const response = res.body;
                //console.log(response);
                expect(response.title).to.equal('foo');
                expect(response.body).to.equal('bar');
                expect(response.userId).to.equal(1);

            })
            .expect(201, done)

    });


});