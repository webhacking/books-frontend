const { profile } = require('./core');

const url = process.argv[2] || 'https://ridibooks.com/';

profile(url).then(
  () => {
    process.exit(0);
  },
  err => {
    console.error(err);
    process.exit(1);
  },
);
