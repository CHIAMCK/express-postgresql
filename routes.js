'use strict'

const list = require('./middleware/list')

module.exports = (router) => {
    router.get('/list', list.list)
}
