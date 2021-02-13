const { getPage } = require('./page.js')
const request = async ({ source = '', transType = 'en2zh', browser }) => {
  const result = { target: '', msg: 'success', code: 0 }
  if (!source) {
    return result
  }
  const sourceLang = transType.split('2')[0] || 'en'
  const targetLang = transType.split('2')[1] || 'zh'
  console.log({ source })
  const url = `https://www.deepl.com/translator#${sourceLang}/${targetLang}/${encodeURIComponent(source)}`
  console.log('url:', url)
  const page = await getPage(browser)
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
        resolve({ target })
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
