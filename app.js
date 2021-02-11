const Koa = require('koa')
const Router = require('koa-router')
const puppeteer = require('puppeteer')
const app = new Koa()
const router = new Router()
const deepl = require('./deepl.js')
// const { getPage } = require('./page.js')
let browser = null
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  console.log('first1')
  if (!browser) {
    browser = await puppeteer.launch({
      // headless: false,
      // defaultViewport: null
    })
  }
  await next()
})
// 请求deepl翻译接口
// http://localhost:3000/deepl/trans?source=hello%20world&transType=en2zh
router.get('/deepl/trans', async ctx => {
  const { query = '' } = ctx.req._parsedUrl
  const source = decodeURIComponent(query.split('&transType=')[0].slice(7))
  const transType = query.split('&transType=')[1]
  const params = {
    source,
    transType,
    browser
  }
  const result = await deepl.request(params)
  ctx.body = result
  return (ctx.status = 200)
})

app.use(router.routes()).use(router.allowedMethods())
app.listen(3000)
