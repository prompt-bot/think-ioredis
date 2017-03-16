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
    let instance = this.getConnection();
  
    const data = await instance.get(this.prefix + this.cookie);
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
  get(name){
    return this.getData().then(() => {
      return !name ? this.data : this.data[name];
    });
  }
  /**
   * set data
   * @param {String} name    []
   * @param {Mixed} value   []
   * @param {Number} timeout []
   */
  set(name, value, timeout){
    if(timeout){
      this.timeout = timeout;
    }
    return this.getData().then(() => {
      this.data[name] = value;
    });
  }
  /**
   * delete data
   * @param  {String} name []
   * @return {Promise}      []
   */
  delete(name){
    return this.getData().then(() => {
      if(name){
        delete this.data[name];
      }else{
        this.data = {};
      }
    });
  }
  /**
   * flush data
   * @return {Promise} []
   */
  flush(){
    return this.getData().then(() => {
      let instance = this.getConnection();
      return instance.set(this.prefix + this.cookie, JSON.stringify(this.data), 'EX', this.timeout);
    });
  }
}
