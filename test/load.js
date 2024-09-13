var Libpq = require('../')

var blink = async function(n) {
  var connections = Array.from({ length: 30 }, () => new Libpq())

  await Promise.all(connections.map(con => new Promise((resolve, reject) => {
    con.connect((err) => {
      if (err) reject(err)
      else resolve()
    })
  })))

  connections.forEach(con => con.finish())
}

describe('many connections', function() {
  it('works', async function() {
    for (let i = 0; i < 10; i++) {
      await blink(i)
    }
  })
})
