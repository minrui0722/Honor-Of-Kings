/*定义 分类 表模型*/
const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  name: {
    type: String
  },
  parent: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Category'
    /*这里的type：表示数据库中的 ObjectId；ref表示关联的是哪一个模型*/
    /*从 'Category'模型中找一个 ObjectId 等于 parent的记录*/
  }
})
module.exports = mongoose.model('Category',schema)
