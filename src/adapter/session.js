'use strict';

import Base from './base'

/**
 * ioredis session
 */
export default class extends Base {
  /**
   * init
   * @param  {Object} options []
   * @return {}         []
   */
  init(config){
    super.init()
    config = think.parseConfig(think.config('session'), config)
    this.nodes = config.nodes || [
      { host: '127.0.0.1', port: 6379 }
    ]
    delete config.nodes
    delete config.type
    this.options = config
    console.log(this.options)
    this.prefix = this.options.prefix || ''
    this.timeout = this.options.timeout || 0
    this.cookie = this.options.cookie;
  }

  /**
   * get session
   * @return {Promise} []
   */
  async getData(){
    
    if(this.data){
      return this.data;
    }

    let instance =await this.getConnection();

    let data = await think.await(`session_${this.cookie}`, () => {
      return instance.get(this.cookie);
    });
    this.data = {};
    try{
      this.data = JSON.parse(data) || {};
    }catch(e){}

    return this.data;
  }
  /**
   * get data
   * @param  {String} name []
   * @return {Promise}      []
   */
  async get(name){
    return this.getData().then(()=>{this.prefix + name})
  }
  /**
   * set data
   * @param {String} name    []
   * @param {Mixed} value   []
   * @param {Number} timeout []
   */
  set(name, value, timeout){
   return this.getConnection().set(this.prefix + name, value, 'EX', this.timeout)
  }
  /**
   * delete data
   * @param  {String} name []
   * @return {Promise}      []
   */
  delete(name){
    return this.getConnection().del(this.prefix + name)
  }
  /**
   * flush data
   * @return {Promise} []
   */
   flush(){
    return this.getData().then(async () => {
     let instance =await  this.getConnection();
     return instance.set(this.cookie, JSON.stringify(this.data), this.timeout);
    });
  }
}