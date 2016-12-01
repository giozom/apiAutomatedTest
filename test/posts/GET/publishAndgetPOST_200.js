'use strict';

var hooks = require('../../hooks.js');

describe('@post', function () {
    let post;

    describe('Creating POST....', function () {

        //Publish POST
        beforeEach(function (done) {

            hooks.createPost()
                .then(function (_post) {
                    post = _post;
                    done();
                });
        });

        //Get POST
        describe('GET /posts/:id after Post Creation', function () {
            //Using assert method to verify response returned with Post ID from createPost function
            it('should GET /posts and return a 200 OK status code', function (done) {
                utils.httpGET(`/posts/${post.id}`, {})
                    .set('content-type', 'application/json; charset=utf-8')
                    .expect(function (res) {
                        const response = res.body;
                        //show response return with Post ID
                        //console.log(response);
                        expect(response).to.have.property('id');
                        expect(response).to.have.property('title');
                        //expect(response).to.have.property('body');
                        expect(response).to.have.property('userId');
                        //Assert Post ID created is equal to the one return in response
                        expect(response.id).to.equal(post.id);
                    })
                    .expect(200, done);
            });
        });
    });
});

