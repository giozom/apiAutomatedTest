# API Automated Testing using Javascript
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

## Running the tests 
* Go to <code>~/apiAutomatedTest/test/</code>
* Type <code>npm test</code>

## Reporting (HTML and JSON)
* To view report go to <code>/apiAutomatedTest/mochawesome-reports/mochawesome.html<code>

## Screenshots
![Alt text](https://github.com/giozom/apiAutomatedTest/blob/master/HTMLReport.png "HTML Report")

## Failed Test
![Alt text](https://github.com/giozom/apiAutomatedTest/blob/master/HTMLReport_FailedTest.png "HTML Report")
