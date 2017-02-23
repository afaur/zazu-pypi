const PyPi = require('./pypi')
const pypi = new PyPi()

module.exports = () => {
  return (query, env = {}) => {
    return pypi.search(query).then((results) => {
      return results.map((result) => {
        return {
          icon: 'icon.png',
          title: result.pkg,
          subtitle: result.info,
          value: result.pkg,
        }
      })
    })
  }
}
