# Fugitive Code Challenge 

## Prerequisites
****

We assume at least intermediate-level knowledge of Javascript. For the server you'll need to [MondoDB](https://docs.mongodb.com/master/tutorial/install-mongodb-on-os-x/?_ga=1.204328082.326616756.1489430903) installed and running, and [NodeJS >= v8.9.0](https://nodejs.org/en/). For the web client and mobile, it's best to have at least a basic understanding of [ReactJS](https://reactjs.com/) and [Redux](https://redux.js.org/).  
> Redux can be a little tricky to wrap your brain around &mdash; particularly the `reducer` mapping. If you want to simply trust us that it works, you can just follow the patterns and you should pick it up eventually.  

Will need to install nodemon if not already installed. 

## Basic Usage
****
1. Clone this repository
1. Change directory to `iTask/server` and start the web server
    ```
    $ cd iTask/server
    $ npm install
    $ nodemon
    ```    
    The Yote server is now listening at `http://localhost:3030` and watching for changes.   
1. In a **new terminal**, change directory to `iTask/web` and start the client
    ```
    $ cd iTask/web
    $ npm install 
    $ npm run debug
    ```
    This runs the Yote client in watch & debug mode to look for and recompile changes to the `bundle.js`
1. Using a browser, go to `http://localhost:3030` and you'll see "Welcome to iTask!"



## Built with the Yote Super Stack
****  

> **WTH is a super-stack solution?**  Glad you asked.  A 'super-stack' is a made up term for a solution that provides a web application, native mobile apps, and api services out of the box.

Yote should always be the most comprehensive and flexible stack available. Right now that stack looks like this:

- **Database**
  * [Mongo](http://www.mongodb.org/)
  * [Mongoose](http://mongoosejs.com/)
- **Server/API**
  * [Node](https://nodejs.org/)
  * [Express](http://expressjs.com/)
  * [Passport](http://passportjs.org/)
  * [Docker](https://www.docker.com/)
- **Web**
  * [React](https://reactjs.com/)
  * [React-Router](https://reacttraining.com/react-router/)
  * [Redux](https://redux.js.org/)


> We'll do our best to support older versions through the CLI, but ultimately Yote is forward-looking in nature



## Philosophy
****

Yote itself is not a framework. It's not even really a library. Our idea is to simply take the best practices of the best frameworks and services available and package them up together in one place. Yote may change the nuts and bolts from time to time but the general philosophy will remain the same: Yote will always provide client-agnostic services and server-agnostic clients that are **FLEXIBLE**, **EXTENDABLE**, and **PERFORMANT** out of the box.  The overall goal is to help developers roll out production ready super-stack solutions as quickly and painlessly as possible.  






## Contributing
****

Yote was initially built by Fugitive Labs for Fugitive Labs. We simply wanted a tool to improve our work. But we think other folks can find it useful too.  We encourage you to contribute. Improvements in mind, please feel free to open a pull request.


## License
****

All super-stack components are released individually under various open source licenses.  Please refer to their documentation for specific licenses.

Yote itself is released under the [MIT License](http://www.opensource.org/licenses/MIT).
