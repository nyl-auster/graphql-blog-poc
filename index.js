/**
 * Boostrap app as soon as we are connected to database
 */
const App = require('./App')
App.start().catch((e) => console.log(e))
