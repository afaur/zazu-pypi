const xmlrpc = require('xmlrpc')
const fuzzyfind = require('fuzzyfind')
const fetch = require('node-fetch')

const DEFAULT_URL = 'https://pypi.python.org/pypi'

class PyPi {
  constructor () {
    this.client = xmlrpc.createSecureClient(DEFAULT_URL)
  }

  getPackages () {
    return new Promise((resolve) => {
      if (this.cache) return resolve()
      this.client.methodCall('list_packages', [], (err, value) => {
        this.cache = value
        resolve()
      })
    }).then(() => {
      return this.cache
    })
  }

  readPkgInfo () {
  }

  search (query) {
    return this.getPackages().then((results) => {

      let promise = Promise.resolve()
      let pkgAndInfo = []

      fuzzyfind(query, results).slice(0, 5).forEach((pkg) => {

        promise = promise.then(() => {
          return new Promise((resolve) => {

            let pkgInfoUrl = `https://pypi.python.org/pypi/${pkg}/json`
            fetch(pkgInfoUrl).then((response) => {
              response.json().then((json) => {
                pkgAndInfo.push({
                  pkg: pkg,
                  info: json['info']['summary']
                })
                resolve()
              })
            })

          })
        })

      })

      return promise.then((response) => {
        return pkgAndInfo
      })

    })
  }

}

module.exports = PyPi
