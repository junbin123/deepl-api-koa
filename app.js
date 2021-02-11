const Koa = require('koa')
const Router = require('koa-router')
const puppeteer = require('puppeteer')
const app = new Koa()
const router = new Router()
const deepl = require('./deepl.js')

app.use(async (ctx, next) => {
  console.log('first1')
  await next()
  console.log('first done2')
})
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



app.use(router.routes()).use(router.allowedMethods())
app.listen(3000)
