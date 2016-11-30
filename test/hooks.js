module.exports = {

    createPost: function(){
        return new Promise(function (resolve, reject){
            const url = '/posts';
            utils.httpPOST(url, {})
                .send({
                    title: 'foo',
                    body: 'bar',
                    userId: 1
                })
                .expect('content-type', 'application/json; charset=utf-8')
                .expect(function (res) {
                    const response = res.body;
                    //console.log(response);
                    expect(response.title).to.equal('foo');
                    expect(response.body).to.equal('bar');
                    expect(response.userId).to.equal(1);
                    expect(response).to.have.property('id');

                })
                .expect(201)
                .end(function (err,res) {

                    if(err) {
                        console.log(err);
                        console.log(res.body)
                    }
                    resolve(res.body);
                });
        });
    }
};
