'use strict';

var hooks = require('../../hooks.js');

describe('@put', function () {

let post;

    //Publish POST
    beforeEach(function (done) {

        hooks.createPost()
            .then(function (_post) {
                post = _post;
                done();
            });
    });

    //Update POST
    it('should return a 200 code after updating post', function (done) {
        utils.httpPUT(`/posts/${post.id}`, {})
            .send(
                {
                    id: `${post.id}`,
                    title: 'candy crush',
                    body: 'sodalicious juicy',
                    userId: 1
                }
            )
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (res) {
                const response = res.body;
                //console.log(response);
                expect(response.title).to.equal('candy crush');
                expect(response.body).to.equal('sodalicious juicy');
                expect(response.userId).to.equal(1);

            })
            .expect(200, done);

    });

});