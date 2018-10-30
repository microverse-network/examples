const async = require('async')

const puppeteer = require('puppeteer')
const randomName = require('node-random-name')

puppeteer
  // Chrome Headless doesn't launch with root user
  .launch({ args: ['--no-sandbox', '--disable-http2'] })
  .then(async browser => {
    async.forever(
      done => {
        start(browser, done)
      },
      err => {
        console.log('execution stopped', err)
        browser.close().then(() => {
          console.log('browser is closed')
        })
      },
    )
  })
  .catch(err => {
    throw new Error('error while launching the browser ' + err.message)
  })

const processPage = async (page, log, name, callback) => {
  page
    .waitForSelector('div.label', {
      timeout: 60 * 1000,
    })
    .then(async divElement => {
      log('selector visible')
      page
        .screenshot({ path: 'screenshot' + name + '.png' })
        .then(() => {
          log('screenshot saved')
          // TODO: success callback is not called intentionally as we want this
          // to stay conected
          // page
          //   .close()
          //   .then(() => {
          //     log('page closed')
          //      callback()
          //   })
          //   .catch(err => {
          //     callback(
          //       new Error('error while creating a screenshot: ' + err.message),
          //     )
          //   })
        })
        .catch(err => {
          callback(
            new Error('error while creating a screenshot: ' + err.message),
          )
        })
    })
    .catch(err => {
      callback(new Error('error while waiting for selector: ' + err.message))
    })
}
let start = async (browser, callback) => {
  browser
    .newPage()
    .then(async page => {
      const name = randomName({ first: true })
      const log = msg => {
        console.log('process', name, 'msg: ', msg)
      }
      // page.on('console', msg => log(msg.text()))
      page.once('load', () => log('page loaded'))
      page.once('domcontentloaded', () => log('page domcontentloadeded'))
      const pageURL = process.env.REMOTE_URL || 'http://localhost:3000'

      page
        .goto(pageURL, {
          timeout: 60 * 1000,
          waitUntil: ['domcontentloaded', 'load'],
        })
        .then(async response => {
          log(response.status())
          processPage(page, log, name, callback)
        })
        .catch(err => {
          callback(new Error('error while opening the page: ' + err.message))
        })
    })
    .catch(err => {
      callback(new Error('error while creating a page: ' + err.message))
    })
}
