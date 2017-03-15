'use strict';

import Base from './base.js';

/**
 * Redis socket class
 */
export default class extends Base {
  /**
   * init
   * @param  {Object} config []
   * @return {}        []
   */
  init(config = {}){
    super.init();
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
  }
  /**
   * add event
   * @param  {String}   event    []
   * @param  {Function} callback []
   * @return {}            []
   */
  on(event, callback){
    return this.getConnection().then(connection => {
      connection.on(event, callback);
    });
  }
  /**
   * wrap
   * @param  {String}    name []
   * @param  {Array} data []
   * @return {Promise}         []
   */
  async wrap(name, ...data){
    await this.getConnection();
    let fn = think.promisify(this.connection[name], this.connection);
    return think.error(fn(...data));
  }
  /**
   * get data
   * @param  {String} name []
   * @return {Promise}      []
   */
  async get(name){
    await this.getConnection();
    return this.connection.get(name);
  }
  /**
   * set data
   * @param {String} name    []
   * @param {String} value   []
   * @param {Number} timeout []
   */
  async set(name, value, timeout = this.timeout){
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
   * set data expire
   * @param  {String} name    []
   * @param  {Number} timeout []
   * @return {Promise}         []
   */
  async expire(name, timeout){
    let instance = await this.getConnection()
    return this.connection.expire( name, timeout);
  }
  /**
   * delete data
   * @param  {String} name []
   * @return {Promise}      []
   */
  async delete(name){
    let instance = await this.getConnection()
    return this.connection.del( name );
  }
  /**
   * close socket connection
   * @return {} []
   */
  close(){
    if(this.connection){
      this.connection.quit();
      this.connection = null;
    }
  }
}