# API Automated Testing using Javascript
![Alt text](https://travis-ci.org/giozom/apiAutomatedTest.svg?branch=master)
 A JS REST Framework using supertest and other cool libraries
 
## Installing json-server
* <code>npm install -g json-server</code>

## Running local json server 
* json-server data.json (where data.json is the api collection)
* $ <code>json-server data.json</code>

## You can view DB current state in your preferred browser
* http://localhost:3000/db

## Resources the JSON Server loaded
* http://localhost:3000/
* http://localhost:3000/posts
* http://localhost:3000/users
* http://localhost:3000/comments

## Running all tests 
* Go to <code>~/apiAutomatedTest/test/</code>
* Type <code>npm run test</code>

## Running specific tests 
* Go to <code>~/apiAutomatedTest/test/</code>
* Type <code>npm run test:get</code> will run all GET tests
* Type <code>npm run test:post</code> will run all POST tests
* Type <code>npm run test:put</code> will run all PUT tests
* Type <code>npm run test:delete</code> will run all DELETE tests

## Reporting (HTML and JSON)
* To view report go to <code>/apiAutomatedTest/mochawesome-reports/mochawesome.html<code>

## Screenshots
![Alt text](https://github.com/giozom/apiAutomatedTest/blob/master/HTMLReport.png "HTML Report")

## Failed Test
![Alt text](https://github.com/giozom/apiAutomatedTest/blob/master/HTMLReport_FailedTest.png "HTML Report")
