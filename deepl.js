const { getPage } = require('./page.js')
const clearText = str => {
  const result = str
    .trim()
    .replace(/[\r\n]/g, '')
    .replace(/\s+/g, ' ')
  return result
}
const request = async ({ source = '', transType = 'en2zh', browser }) => {
  const result = { target: '', msg: 'success', code: 0 }
  if (!clearText(source)) {
    return result
  }
  const sourceLang = transType.split('2')[0] || 'en'
  const targetLang = transType.split('2')[1] || 'zh'
  console.log({ source })
  const url = `https://www.deepl.com/translator#${sourceLang}/${targetLang}/${encodeURIComponent(source)}`
  const page = await getPage(browser)
  console.log('跳转到', url)
  await page.goto(url)
  // 监听翻译结果
  const promise = new Promise(async (resolve, reject) => {
    let index = 0
    let target = ''
    const timer = setInterval(async () => {
      index += 1
      target = await page.$eval('#target-dummydiv', el => el.textContent)
      console.log('等待：', { index, target })
      if (clearText(target)) {
        console.log('----1')
        resolve({ target: clearText(target) })
        clearInterval(timer)
      }
      if (index === 400) {
        console.log('----2')
        resolve({ target })
        // 超过20s
        reject({ msg: '请求超时' })
      }
    }, 50)
  })
  const { target = '' } = await promise
  console.log('请求完成', target)
  return { ...result, target }
}

module.exports = {
  request
}
