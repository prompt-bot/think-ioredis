'use strict'

import Redis from 'ioredis'
/**
 * socket base class
 */
export default class extends think.adapter.base {
  /**
   * init
   * @return {} []
   */
  init () {
    this.connection = null
    // query queue nums
    this.queueNums = 0
    // auto close socket timer
    this.closeTimer = 0
  }
  /**
   * log connection
   * @return {} []
   */
  logConnect (str, type) {
    // log mongodb connection infomation
    if (think.config.log_connect) {
      think.log(colors => {
        return `Connect ${type} with ` + colors.magenta(str)
      }, 'SOCKET')
    }
  }

  /**
   * connect redis
   * @return {Promise} []
   */
  getConnection () {
    if (this.connection) {
      return this.connection
    }
    let str = 'nodes:' + JSON.stringify(this.nodes) + ' =====> '
    try {
      if (this.nodes.length === 1) {
        this.connection = new Redis(this.nodes[0].host, this.nodes[0].port, this.options)
        str += 'Redis Model'
      }else {
        this.connection = new Redis.Cluster(this.nodes, this.options)
        str += 'Redis Cluster Model'
      }
      this.logConnect(str, 'redis')
      return this.connection
    } catch(e) {
      return think.error(new Error(e))
    }
  }
}
