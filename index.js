/**
 * Boostrap app as soon as we are connected to database
 */
const App = require('./app')
App.start().then(() => {
  console.log("application started")
})
