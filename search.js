const PyPi = require('./pypi')

const pypi = new PyPi()

pypi.search('dbcl').then((results) => {
  console.log('Results: ', results)
})
