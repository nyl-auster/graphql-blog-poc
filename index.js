/**
 * Boostrap app as soon as we are connected to database
 */
const App = require('./app')
const PostService = require('./modules/blog/services/PostService')
App.start().catch((e) => console.log(e))
