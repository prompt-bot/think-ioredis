'use strict'

import Base from './base'

/**
 * ioredis cache adapter
 */
export default class extends Base {

  /**
   * init
   * @return {[]}         []
   */
  init (config) {
    super.init()
    config = think.parseConfig(think.config('ioredis'), config)
    this.nodes = config.nodes || [
      { host: '127.0.0.1', port: 6379 }
    ]
    delete config.nodes
    delete config.type
    this.options = config
    console.log(this.options)
    this.prefix = this.options.prefix || ''
    this.timeout = this.options.timeout || 0
    this.gcType = 'cache_ioredis'
    think.gc(this)
  }

  /**
   * get value
   * @param  {String} key []
   * @return {Promise}     []
   */
   async get (key) {
     let instance = await this.getConnection()
    return instance.get(this.prefix + key).then(value => {
      if (value) {
        return JSON.parse(value)
      }
    }).catch(() => {
    })
  }
  /**
   * set key value
   * @param {any} name 
   * @param {any} value 
   * @param {any} [timeout=this.timeout] 
   * @returns {Promise} []
   */
  async set (name, value, timeout = this.timeout) {
    let instance = await this.getConnection()
    if (think.isObject(name)) {
      timeout = value || timeout
      let key = Object.keys(name)[0]
      value = name[key]
      name = key
    }
    value = JSON.stringify(value)
    return instance.set(this.prefix + name, value, 'EX', this.timeout)
      .catch(() => {
      })
  }

  /**
   * delete key
   * @param  {String} key []
   * @return {Promise}     []
   */
  delete (key) {
    return this.getConnection().del(this.prefix + key)
      .catch(() => {
      })
  }
}
