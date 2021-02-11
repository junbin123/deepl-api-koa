const getPage = async browser => {
  const pageList = await browser.pages()
  if (pageList.length === 0) {
    console.log(1)
    // 没有页面
    const p1 = await browser.newPage()
    return p1
  } else {
    const page = pageList.find(item => /https:\/\/www.deepl.com/.test(item.url()))
    if (page) {
      console.log(3)
      // 页面打开deepl
      const target = await page.$eval('#target-dummydiv', el => el.textContent.replace(/[\r\n]/g, ''))
      if (target) {
        // 有翻译结果
        console.log(4)
        return page
      }
    }
    console.log(6)
    const p2 = await browser.newPage()
    return p2
  }
}
module.exports = {
  getPage
}
