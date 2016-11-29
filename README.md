# api-tests
 A JS REST Framework using supertest and other cool libraries
 
## Installing json-server
* npm install -g json-server

## Running local json server 
* $ json-server <data.json> (where data.json is the api collection)
* $ <code>json-server data.json</code>

## You can view DB current state
* http://localhost:3000/db

## Resources the JSON Server loaded
* http://localhost:3000/
* http://localhost:3000/posts
* http://localhost:3000/users
* http://localhost:3000/comments

## Running the tests (~/apiAutomatedTest/test/)
* <code>npm test</code>

## Reporting (HTML and JSON)
* /apiAutomatedTest/mochawesome-reports/mochawesome.html

## Screenshots
![Alt text](https://github.com/giozom/apiAutomatedTest/blob/master/HTMLReport.png "HTML Report")

## Failed Test
![Alt text](https://github.com/giozom/apiAutomatedTest/blob/master/HTMLReport_FailedTest.png "HTML Report")
