const xmlrpc = require('xmlrpc')
const fuzzyfind = require('fuzzyfind')
const fetch = require('node-fetch')

const DEFAULT_URL = 'https://pypi.python.org/pypi'

class PyPi {
  constructor () {
    this.client = xmlrpc.createSecureClient(DEFAULT_URL)
    this.pkgResults = []
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

  search (query) {
    const packageResults = []

    const readResponse = (response) => {
      return response.json()
    }

    const addPkgResult = (json) => {
      packageResults.push({
        pkg: json['info']['name'],
        info: json['info']['summary']
      })
    }

    return this.getPackages().then((results) => {
      let promise = Promise.resolve()
      fuzzyfind(query, results).slice(0, 5).forEach((pkg) => {
        promise = promise.then(() => {
          let pkgDetails = `https://pypi.python.org/pypi/${pkg}/json`
          return fetch(pkgDetails).then(readResponse).then(addPkgResult)
        })
      })
      return promise.then((response) => {
        return packageResults
      }).catch((e) => {
        console.error('fail', e)
      })
    })
  }

}

module.exports = PyPi
