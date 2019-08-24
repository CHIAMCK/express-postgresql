
const express = require('express')
const nconf = require('nconf')
// parse incoming request bodies
const bodyParser = require('body-parser')
const session = require('express-session')
//  redis session store for Express
const RedisStore = require('connect-redis')(session)
// using node_redis, redis client for node
const redis = require('redis')
const client = redis.createClient()
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')

nconf
  .argv()
  .env()

// setup database connection
require('./model')

const app = new express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}))

// parse application/json
app.use(bodyParser.json())

// Lets you use HTTP verbs such as PUT or DELETE in places
// where the client doesn't support it.
app.use(methodOverride())

// parser cookie header and populate req.cookie
app.use(cookieParser());

app.use(session({
  saveUninitialized: true,
  // forces the session to be saved back to the sesion store,
  // even if the session was never modified during the request
  resave: false,
  //  to sign the session ID cookie
  secret: nconf.get('SESSION_COLLECTION'),
  //  session store instance
  store: new RedisStore({
    client: client,
    host: nconf.get('REDIS_HOST'),
    port: nconf.get('REDIS_PORT')
  })
}))

// setup db connections
require('./model')

// route setting
const routes = require('./routes')
routes(app)

// port setting
const port = nconf.get('PORT')
const server = app.listen(port)
console.log(`server running at port ${port}`)

module.exports = server
