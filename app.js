const Koa = require('koa')
const Router = require('koa-router')
const render = require('koa-ejs')
const path = require('path')
const puppeteer = require('puppeteer')
const app = new Koa()
const router = new Router()
const deepl = require('./deepl.js')

const source = `Then, for a precious few days, that wall was breached.
  <%%>
  For years, the Chinese government has prevented its 1.4 billion people from speaking freely online.
  <%%>
  They had a lot to say.`

app.use(async (ctx, next) => {
  console.log('first1')
  await next()
  console.log('first done2')
})
// app.use(async (ctx, next) => {
//   console.log('second')
//   await next()
//   console.log('second done')
// })
// app.use(async ctx => {
//   ctx.body = 'hello worldsdf sdfkj '
// })
//
// 请求deepl翻译接口
// http://localhost:3000/deepl/trans?source=hello%20world&transType=en2zh
router.get('/deepl/trans', async ctx => {
  const { query = '' } = ctx.req._parsedUrl
  const source = decodeURIComponent(query.split('&transType=')[0].slice(7))
  const transType = query.split('&transType=')[1]
  const params = {
    source,
    transType
  }
  const result = await deepl.request(params)
  ctx.body = result 
  return (ctx.status = 200)
})

router.get('/pk/:id', ctx => {
  // ctx.body = ctx.params // 路径参数
  // console.log('===', ctx)
  // console.log("hello wujunbin");
  return (ctx.status = 200)
})
// router.post('/user/:id', ctx => {
//   ctx.body = ctx.request.req
//   return (ctx.status = 200)
// })

render(app, {
  root: path.join(__dirname, 'views'),
  layout: 'template',
  viewExt: 'html',
  cache: false,
  debug: false,
  async: true
})

const users = ['hello', 'world']
router.get('/users', async ctx => {
  await ctx.render('index', {
    users
  })
})

app.use(router.routes()).use(router.allowedMethods())
app.listen(3000)
