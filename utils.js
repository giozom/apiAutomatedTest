"use strict";
var config = require('konfig')();
var supertest = require("supertest-as-promised");


var utils = {

    apiUsername: config.properties.apiUser,
    apiPassword: config.properties.apiPassword,

    getHost: function getHost() {
        return config.properties.host;
    },

    postHost: function postHost() {
        return config.properties.host;
    },

    putHost: function postHost() {
        return config.properties.host;
    },

    deleteHost: function postHost() {
        return config.properties.host;
    },

    /**
     *
     @param url
     @param additionalParams - object / optional
     {
       accept: set Accept header to alternative value
       username: set username to alternative value
       password: set password to alternative value
     }
     */
    httpGET: function httpGET(url, additionalParams) {

        var acceptHeader, alternateUsername, alternatePassword;
        if (additionalParams != undefined) {
            if (additionalParams.accept != undefined) {
                acceptHeader = additionalParams.accept;
            }

            if (additionalParams.username != undefined) {
                alternateUsername = additionalParams.username;
            }

            if (additionalParams.password != undefined) {
                alternatePassword = additionalParams.password;
            }
        }

        return supertest(utils.getHost())
            .get(url)
            .set('Accept', 'application/json')
            .set('Accept', acceptHeader ? acceptHeader : 'application/json')
            .auth(alternateUsername ? alternateUsername : this.apiUsername, alternatePassword ? alternatePassword : this.apiPassword)
    },

    httpPOST: function httpPOST(url, content, additionalParams) {

        var acceptHeader, alternateUsername, alternatePassword;
        if (additionalParams != undefined) {
            if (additionalParams.accept != undefined) {
                acceptHeader = additionalParams.accept;
            }

            if (additionalParams.username != undefined) {
                alternateUsername = additionalParams.username;
            }

            if (additionalParams.password != undefined) {
                alternatePassword = additionalParams.password;
            }
        }

        return supertest(utils.postHost())
            .post(url)
            .send(content)
            .set('Accept', acceptHeader ? acceptHeader : 'application/json')
            .auth(alternateUsername ? alternateUsername : this.apiUsername, alternatePassword ? alternatePassword : this.apiPassword)
    },

    httpPUT: function httpPUT(url, body, additionalParams) {

        var acceptHeader, alternateUsername, alternatePassword;
        if (additionalParams != undefined) {
            if (additionalParams.accept != undefined) {
                acceptHeader = additionalParams.accept;
            }

            if (additionalParams.apiusername != undefined) {
                alternateUsername = additionalParams.apiusername;
            }

            if (additionalParams.apipassword != undefined) {
                alternatePassword = additionalParams.apipassword;
            }
        }

        return supertest(utils.putHost())
            .put(url)
            .send(body)
            .set('content-type', 'application/json; charset=utf-8')
            .set('Accept', acceptHeader ? acceptHeader : 'application/json')
            .auth(alternateUsername ? alternateUsername : this.apiUsername, alternatePassword ? alternatePassword : this.apiPassword)
    },

    httpDELETE: function httpDELETEGeneral(url, additionalParams) {

        var acceptHeader, alternateUsername, alternatePassword;
        if (additionalParams != undefined) {
            if (additionalParams.accept != undefined) {
                acceptHeader = additionalParams.accept;
            }

            if (additionalParams.apiusername != undefined) {
                alternateUsername = additionalParams.apiusername;
            }

            if (additionalParams.apipassword != undefined) {
                alternatePassword = additionalParams.apipassword;
            }
        }
        return supertest(utils.deleteHost())
            .delete(url)
            .set('content-type', 'application/json; charset=utf-8')
            .set('Accept', acceptHeader ? acceptHeader : 'application/json')
            .auth(alternateUsername ? alternateUsername : this.apiUsername, alternatePassword ? alternatePassword : this.apiPassword)
    }


};

module.exports = utils;