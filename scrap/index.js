const osmosis = require('osmosis')
const fs = require('fs')

var types = ['traditional', 'simplified']

types.forEach(function (type) {
  var cnt = 0
  var caracteres = []
  var caracteresComplet = []

  osmosis.get('http://www.learnchineseez.com/read-write/' + type + '/index.php?page=1')
  .find('#paging a')
  .follow('@href')
  .find('.chartable td a')
  .set({
      character: '.',
      url: '@href'
  })
  // .follow('@href')
  // .find('.proverbtable')
  // .set({
  //   meanings: ['tr']
  // })
  .data(function (data) {
    if (Object.keys(data).length) {
      cnt++

      let id = data.url.match(/code=(\w|\d)+&/)[0].split('=')[1]
      id = id.substr(0, id.length - 1)

      caracteres.push(data.character)

      caracteresComplet.push({
        id,
        symbol: data.character,
        href: data.url,
      })

      if (cnt === 3999) {
        const finalSet = {
          caracteres,
          caracteresComplet,
        }

        fs.writeFile(type + '.json', JSON.stringify(finalSet), 'utf8', function (err) {
          if (err) {
            throw err
          }

          console.log('== Wrote ' + caracteres.length + ' ' + type + ' characters in ' + type + '.json')
        })
      }
    }
  })
  .error(console.error)
  // .debug(console.info)
})
