/*定义文章相关的数据库信息*/
const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  title: { type: String },
  /*由于文章可所属多个分类，所以这里采用数组的形式，每个分类的类型是所属关联的 Category模型*/
  categories: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }],
  body: { type: String }//详情
})
module.exports = mongoose.model('Article',schema)