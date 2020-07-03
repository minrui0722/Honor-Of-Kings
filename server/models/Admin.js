/*定义 管理员 相关的数据库信息 */
const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  username: { type: String },
  password: { type: String }
})
module.exports = mongoose.model('Admin',schema)