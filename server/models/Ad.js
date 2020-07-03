/*定义 广告位 相关的数据库信息 */
const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  name: { type: String },
  /*每一个广告位里面有三张幻灯片图片，每点击一个幻灯片都会跳转到对应的页面地址*/
  items: [{
    /*每一张广告都有一张图片；还有一个看不见的字段即点击之后跳转的 url*/
    image: { type: String },
    url: { type: String }
  }]
})
module.exports = mongoose.model('Ad',schema)