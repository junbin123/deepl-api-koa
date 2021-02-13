const Koa = require('koa')
const Router = require('koa-router')
const puppeteer = require('puppeteer')
const app = new Koa()
const router = new Router()
const deepl = require('./deepl.js')
const cors = require('@koa/cors')
// const { getPage } = require('./page.js')
let browser = null
puppeteer
  .launch({
    headless: false,
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  .then(res => {
    console.log('hhh')
  })

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*')
  console.log('first1')
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
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

app.use(router.routes()).use(router.allowedMethods()).use(cors())

app.listen(3000, () => {
  console.log('服务已启动, 请访问http://localhost:3000')
})
