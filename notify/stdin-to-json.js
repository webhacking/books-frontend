const buffers = [];
process.stdin.on('data', data => buffers.push(data));
process.stdin.on('end', () => {
  const data = Buffer.concat(buffers);
  console.log(`:book:\n${String(data)}`);
});
process.stdin.on('error', console.error);
