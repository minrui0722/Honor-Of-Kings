
module.exports = options => {
  return async (req,res,next) => {
    /*中间件处理函数*/
    /*classify的作用是将字符串转为类名的作用：categories --> Category*/
    const modelName = require('inflection').classify(req.params.resource)
    // return res.send(modelName)
    /*表示再请求对象中挂在模型model*/
    req.Model = require(`../models/${modelName}`)
    next()
  }
}