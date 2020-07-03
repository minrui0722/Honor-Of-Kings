
/*
* 由于这种用户登录验证，可能时管理员登录，也可能是用户登录，所有的验证都是一样的，只不过是查询和返回的数据不一样俄日一，为了夸大登录校验的扩展性，就必须要使用的一个函数返回该中间件函数，这样不仅可以登录校验，还可以配置查询和校验的信息
* */

//不就收参数
// module.exports = () => {...}
//接收一个函数options
module.exports = options => {
  const Admin = require('../models/Admin')
  const jwt = require('jsonwebtoken')
  const assert = require('http-assert')

  return async (req,res,next) => {
    /*获取用户的token信息，当请求头没有携带token时，说明用户没有登陆，则获取到的token为空值*/
    /*利用的字符串中的split()提取出真正的token，因为前端为了规范，在前台增加了 ‘Bear ’*/
    const token = String(req.headers.authorization || '').split(' ').pop()
    /*如果token不存在则抛出异常，因为不存在token不能使用jwt.verify校验*/
    assert(token,401,'请登录！')//说明用户未登录，没有 jwt token
    /*提取后台的token数据*/
    /*verify就将一长串的token字符解析成对应的用户id*/
    const { id } = jwt.verify(token,req.app.get('secret'))
    /*通过校验得到的ID去数据库中寻找真正的ID，防止前台伪造*/
    assert(id,401,'登陆无效，请重新登录！')//说明客户端篡改token，无效的 jet token
    /*这个adminUser只能在中间件处理函数中使用，如果想要后续的函数也是用这个变量，则需要将该变量挂在到请求对象req中*/
    req.adminUser = await Admin.findById(id)
    assert(req.adminUser,401,'请登录！')//说明数据库中不存在该token的用户
    await next()
  }
}