var PQ = require('../');

describe('Constructing multiple', function() {
  it('works all at once', function() {
    for(var i = 0; i < 1000; i++) {
      var pq = new PQ();
    }
  });

  it('connects and disconnects each client', async function() {
    const connectPromise = (n) => {
      return new Promise((resolve, reject) => {
        const pq = new PQ();
        pq.connect((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    };

    const promises = Array.from({ length: 30 }, (_, i) => connectPromise(i));
    await Promise.all(promises);
  });
})
