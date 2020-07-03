const express = require('express')

const app = express()

//向全局环境中的express实例上设置一个变量名为“secret”，值为任意“adminuser0722”
app.set('secret','adminuser0722')

//跨域模块
app.use(require('cors')())

//配置信息
app.use(express.json())

//开放静态资源
app.use('/uploads',express.static(__dirname+'/uploads'))


/*注意：一定要将路由的引入放在 cors 包之后，否则即使使用了 cors 包还是会出现跨域问题！！！！！*/
require('./plugins/db')(app)
require('./routes/admin/adminRouter')(app)

app.listen(3000,() => {
  console.log('Honor Of Kings server is running at "127.0.0.1:3000"...');
})