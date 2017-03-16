const assert = require('assert')
const path = require('path')
const fs = require('fs')
const http = require('http')

const thinkjs = require('thinkjs')
const instance = new thinkjs()
instance.load()

const Class = require('../lib/index.js')

describe('think-ioredis', function () {
  it('集成到thinjs中测试', function () {})
  it('test async', function (done) {
    Promise.resolve().then(function () {
      done()
    })
  })
})
