// ㆏ ~ ㄰
// 0x3131 = ㄱ;
// 0x318f = ㆎ;
export const isOnsetNucleusCoda = (char: string) => {
  if (!char || char.length < 1) {
    throw new Error('Can not get a character');
  }

  return 0x3130 < char.charCodeAt(0) && char.charCodeAt(0) < 0x3190;
};
