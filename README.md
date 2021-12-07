Gateways is a REST API project for managing gateways and their attached peripheral devices.

The project is written following an MVC pattern for more clarity and separation of concerns.

Make sure you have a local Mongodb instance (without authentication spun up and ready)

To install the project dependencies, from within the project directory we first do

`npm install`

Next, we start the web server by doing

`npm run start`

I have provided some development data to test the API with. In addition to that, I included a requests.rest
file in the project directory which is a vscode REST plugin where I have prepared some ready requests to test the different requirements of the API.

Now the server is up and listening for attempts of http requests on port `4000`.

To run an http request inside the requests.rest file, you have to install vscode REST plugin and press on the `send request` button above each request.

Inside the tests folder, I wrote a simple test suite to test the various endpoints of the API.

You can run the tests by doing, from within project directory

`npm test`

I chose to also build an endpoint for the devices separate from the gateways endpoint. Maybe from an administrative point of view, the devices endpoint could be useful. The endpoint for devices includes basic CRUD operations.

The endpoint for gateways include basic CRUD operations plus some other operations related to attaching and removing devices from gateways.
