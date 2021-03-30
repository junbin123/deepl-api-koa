// 获取空闲的标签页，用于打开
const getPage = async browser => {
  const pageList = await browser.pages()
  if (pageList.length === 0) {
    console.log('获取标签页', 1)
    // 没有页面
    const p1 = await browser.newPage()
    return p1
  } else {
    console.log('获取标签页', 2)
    const page = pageList.find(item => /https:\/\/www.deepl.com/.test(item.url()))
    if (page) {
      console.log('获取标签页', 3)
      // 页面打开deepl
      const target = await page.$eval('#target-dummydiv', el => el.textContent.replace(/[\r\n]/g, ''))
      if (target) {
        // 有翻译结果
        console.log('获取标签页', 4)
        return page
      }
    }
    console.log('获取标签页', 5)
    const p2 = await browser.newPage()
    return p2
  }
}
module.exports = {
  getPage
}
