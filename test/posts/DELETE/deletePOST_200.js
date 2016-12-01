'use strict';

var hooks = require('../../hooks.js');

describe('@delete', function () {

    let post;

    //Publish POST
    beforeEach(function (done) {

        hooks.createPost()
            .then(function (_post) {
                post = _post;
                done();
            });
    });

    //Delete POST
    it('should return a 200 code after deleting Post Created', function (done) {
         utils.httpDELETE(`/posts/${post.id}`, {})
             .set('content-type', 'application/json; charset=utf-8')
             .send(
                {
                    id: post.id,
                    title: 'foo',
                    body: 'bar',
                    userId: 1
                }
            )
            .expect(function (res) {
                const response = res.body;
                //console.log(response)
                return assert.deepEqual(response,
                    {} //return empty response
                );
            })
             .expect(200, done);

     });


});