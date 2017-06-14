/**
 * Bootstrap our app
 */
//require('./App').start().catch((e) => console.log(e))
const App = require('./App')
new App().start()
.then(e => console.log(App))
.catch(e => console.log(e.message))
