const expect = require('chai').expect
const search = require('./search')()

describe('search', function () {
  this.timeout(15000);
  it('returns results', () => {
    return search('dbcli').then((results) => {
      expect(results[0].title).to.include('dbcli')
      expect(results[0].subtitle).to.include('')
    })
  })
})

describe('.zazurc.json', () => {
  it('parses correctly', () => {
    const zazu = require('./zazu.json')
    expect(zazu).to.be.an('object')
  })
})
