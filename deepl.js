const puppeteer = require('puppeteer')
const request = async ({ source = '', transType = 'en2zh' }) => {
  const result = { target: '', msg: 'success', code: 0 }
  if (!source) {
    return result
  }
  const sourceLang = transType.split('2')[0] || 'en'
  const targetLang = transType.split('2')[1] || 'zh'
  const url = `https://www.deepl.com/translator#${sourceLang}/${targetLang}/${encodeURIComponent(source.replace(/\r?\n|\r/g, ''))}`
  const browser = await puppeteer.launch({
    // headless: false,
    // defaultViewport: null
  })
  const page = await browser.newPage()
  console.log('新建标签页')
  await page.goto(url)
  // 监听翻译结果
  const promise = new Promise(async (resolve, reject) => {
    let index = 0
    const timer = setInterval(async () => {
      console.log(index)
      index += 1
      const target = await page.$eval('#target-dummydiv', el => el.textContent)
      if (target) {
        resolve({ target })
        clearInterval(timer)
      }
      if (index === 400) {
        // 超过20s
        reject({ msg: '请求超时' })
      }
    }, 50)
  })
  const { target = '' } = await promise
  console.log('---', target)
  return { ...result, target }
}

module.exports = {
  request
}
