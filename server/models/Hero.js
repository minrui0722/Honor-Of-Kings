/*定义与 英雄 相关的数据库信息*/
const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  name: { type: String },//名字
  avatar: { type: String },//头像
  title: { type: String },//称号
  categories: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }],//利用数组关联多个分类
  /*复合类型：里面有子类型*/
  scores: {
    difficult: { type: Number },//难度评分
    skills: { type: Number },//技能评分
    attack: { type: Number },//攻击评分
    survive: { type: Number },//生存评分
  },
  /*有多个技能（数组），每个技能包括头像，标题，描述文字等（对象）*/
  skills: [{
    icon: { type: String },//技能图标
    name: { type: String },//技能名称
    description: { type: String },//技能描述
    tips: { type: String }//技能小提示
  }],
  /*装备：这里因为已经把所有的装备分到另外的模型当中去了，是单独管理的，是一个装备库，这些装备不是针对某一个英雄的（所以不直接选择对象），而是另外一套装备库（所以选择关联），通过关联的方式去选取装备。有两套装备，一套是“顺风出装” items1，另一套是逆风出装items2*/
  items1: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Item' }],
  items2: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Item' }],
  /*使用技巧*/
  usageTips: { type: String },
  /*对抗技巧*/
  battleTips: { type: String },
  /*团战思路*/
  teamTips: { type: String },
  /*英雄关系：搭档。每选择一个搭档，有图标还有一段描述文字.每一个选择都是针对的是某一个英雄，所以选择对象*/
  partners: [{
    hero: { type: mongoose.SchemaTypes.ObjectId, ref: 'Hero' },
    description: { type: String }
  }]
})
module.exports = mongoose.model('Hero',schema)