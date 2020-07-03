/*所有关于后台管理 admin的所有路由信息，导出的是一个函数，需要一个参数 app*/
module.exports = app => {
  const express = require('express')
  const Admin = require('../../models/Admin')
  const jwt = require('jsonwebtoken')
  const assert = require('http-assert')
  const adminRouter = express.Router({
    /*表示合并url参数*/
    mergeParams: true
  })

  //=====================新建列表
  adminRouter.post('/',async (req,res) => {
    /*将客户端提交的数据保存在数据库中*/
    const categoryModel = await req.Model.create(req.body)
    res.send(categoryModel)
  })
  //========================处理提交的编辑内容，并更新数据库中的数据信息
  adminRouter.put('/:id',async (req,res) => {
    /*将客户端编辑提交的数据重新更新保存在数据库中*/
    const updateItems = await req.Model.findByIdAndUpdate(req.params.id,req.body)
    res.send(updateItems)
  })
  //======================删除记录
  adminRouter.delete('/:id',async (req,res) => {
    /*根据客户端传递过来的id，删除数据库中对应 ID 的数据信息*/
    await req.Model.findByIdAndRemove(req.params.id)
    res.send({
      success: true
    })
  })
  //=========================处理获取列表数据
  adminRouter.get('/',async (req,res) =>{
    /*
    * 注意：由于这里并不是所有的模型都有关联操作，这里就要进行判断
    * */
    const querySelections = {}
    /*表示如果表模型名字为 Category，则添加一个populate属性，查询关联 'parent'中的数据*/
    if(req.Model.modelName === 'Category'){
      querySelections.populate = 'parent'
    }
    /*limit(10)表示限制查找的列表数量最多10条*/
    const categoryItems = await req.Model.find().setOptions(querySelections).limit(10)
    /* populate('xxx')表示关联取出xxx的字段，并且以对象的方式返回 xxx字段*/
    res.send(categoryItems)
  })
  //============================列表详情，获取编辑页面内容
  adminRouter.get('/:id',async (req,res) => {
    /*根据客户端传递过来的 ID，找到对应 ID的数据信息并返回*/
    const itemID = await req.Model.findById(req.params.id)
    res.send(itemID)
  })





  //==============登录校验中间件
  const authMiddleWare = require('../../middleWare/auth')
  //==================自定义资源中间件
  const resourceMiddleWare = require('../../middleWare/resource')


  //第一个参数是 baseURL，即匹配以'/admin/api'开头的路由，第二个参数是将路由挂载到 app 上
  app.use('/admin/api/rest/:resource',authMiddleWare(),resourceMiddleWare(),adminRouter)
  /*/rest表示前缀，为了防止冲突；：resource表示动态传递参数，可以是categories，也可以是heroes等*/



  /*由于还有一些其他的路由，所以可以单独写接口*/
  const multer = require('multer')//中间件 multer 用于处理获取图片数据，express本身没有提供获取文件数据的功能
  const upload = multer({dest:__dirname + '/../../uploads'})//dest：表示目标地址，将图片上传到uploads文件夹中。注意！！！！！！，这里的移动要加一个**根路径 / ***，否则无法将图片保存在uploads文件夹中
  //处理客户端提交的图片信息
  app.post('/admin/api/upload',authMiddleWare(),upload.single('file'),async (req,res) => {
    /*upload.single(xxx)表示接收单个文件的上传字段名为 xxx，对应客户端传递个服务端的 form data中的file*/
    /*本身请求对象中req是没有file属性的，由于使用了中间件multer，就会自动将文件信息挂载到请求对象req中*/
    const file = req.file
    /*手动拼出图片地址并将其发送回客户端*/
    file.url = `http://localhost:3000/uploads/${file.filename}`
    res.send(file)//由于该图片是存储在服务端的，对客户端是默认不可见的，所以我们要将存储图片的文件夹开放出去，对于客户端时可见的
  })


  //=============登录相关的接口===============
  app.post('/admin/api/login',async (req,res) =>{
    const {username,password} = req.body
    //1.验证用户名
    const adminUser = await Admin.findOne({username})
    assert(adminUser,422,'用户不存在！')
    // if(!adminUser){
    //   return res.status(422).send({
    //     message: '用户不存在！'
    //   })
    // }
    //2.用户存在验证密码
    const adminPassword = await Admin.findOne({password})
    assert(adminPassword,422,'密码错误！')
    // if(!adminPassword){
    //   return res.status(422).send({
    //     message: '密码错误！'
    //   })
    // }
    //3.返回token，使用jsonWebToken包
    /*
    * 第一个参数表示放在token中的数据payload，第二个参数是secret密钥，表示在生成token时，需要给一个密钥，然后自动根据算法生成这个token，然后客户端就不需要密钥就可以将数据解出来，即使客户端篡改了该数据，服务端也可以通过sign对应的方法去判断篡改的信息是无效的
    * */
    /*获取全局变量中设定的变量app.set('secret','adminuser0722')，这里的app.get()只能传一个值，如果传两个值会被认为是设定路由*/
    const token = jwt.sign({id: adminUser._id},app.get('secret'))
    res.send({
      token: token,//向客户端返回token数据
      username: adminUser.username//向客户端返回该用户的登录名
    })
  })



  //===============错误处理函数
  app.use(async (err,req,res,next) => {
    /*捕获异常并处理信息*/
    /*如果没有状态码，就默认设置为500，否则会报错invalid status code：undefined*/
    res.status(err.statusCode || 501).send({
      message: err.message
    })
  })

}



/*=============================非通用接口=============================*/
// module.exports = app => {
//   const express = require('express')
//   const adminRouter = express.Router()
//   const CategoryModel = require('../../models/CategoryModel')
//
//   //新建分类名称
//   adminRouter.post('/categories',async (req,res) => {
//     const categoryModel = await CategoryModel.create(req.body)
//     res.send(categoryModel)
//   })
//   //处理提交的编辑内容，并更新数据库中的数据信息
//   adminRouter.put('/categories/:id',async (req,res) => {
//     const updateItems = await CategoryModel.findByIdAndUpdate(req.params.id,req.body)
//     res.send(updateItems)
//   })
//   //删除记录
//   adminRouter.delete('/categories/:id',async (req,res) => {
//     await CategoryModel.findByIdAndRemove(req.params.id)
//     res.send({
//       success: true
//     })
//   })
//   //处理获取列表数据
//   adminRouter.get('/categories',async (req,res) =>{
//     /*limit(10)表示限制查找的列表数量最多10条*/
//     const categoryItems = await CategoryModel.find().populate('parent').limit(10)
//     /* populate('xxx')表示关联取出xxx的字段，并且以对象的方式返回 xxx字段*/
//     res.send(categoryItems)
//   })
//   //获取编辑页面内容
//   adminRouter.get('/categories/:id',async (req,res) => {
//     const itemID = await CategoryModel.findById(req.params.id)
//     res.send(itemID)
//   })
//   //第一个参数是 baseURL，即匹配以'/admin/api'开头的路由，第二个参数是将路由挂载到 app 上
//   app.use('/admin/api',adminRouter)
// }