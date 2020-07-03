/*定义 物品 相关的数据库信息*/
const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  name: {type: String},
  icon: {type: String}
  /*
  * 注意：对于图片的保存，不会将一个图片的完整信息保存到数据库中去，而是将图片上传到一个地址，然后在数据库中以字符串的形式保存这个地址即可
  * */
})
module.exports = mongoose.model('Item',schema)