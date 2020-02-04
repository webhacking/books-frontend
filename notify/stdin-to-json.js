const buffers = [];
process.stdin.on('data', data => buffers.push(data));
process.stdin.on('end', () => {
  const data = Buffer.concat(buffers);
  console.log(`:book: 변경 사항\\n${String(data)}`.replace(/\*/g, '\\n'));
});
process.stdin.on('error', console.error);
