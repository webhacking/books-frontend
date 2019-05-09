import { isOnsetNucleusCoda } from 'src/utils/hangle';

// 0x3131 = ㄱ;
// 0x318f = ㆎ;
const min = 0x3131;
const max = 0x318f;

const getRandomOnsetNucleusCoda = () =>
  String.fromCharCode(Math.floor(Math.random() * (max - min + 1) + min));

describe('hangle utils test', () => {
  it('should be return false', () => {
    expect(isOnsetNucleusCoda('하')).toBe(false);
    expect(isOnsetNucleusCoda('김치')).toBe(false);
    expect(isOnsetNucleusCoda('Jeff Buckley')).toBe(false);
    expect(isOnsetNucleusCoda('미스터 초벌왕')).toBe(false);
  });
  it('should be return true', () => {
    expect(isOnsetNucleusCoda(getRandomOnsetNucleusCoda())).toBe(true);
  });
  it('should be throw an error', () => {
    const err = new Error('Can not get a character');
    // @ts-ignore
    expect(() => isOnsetNucleusCoda()).toThrowError(err);
  });
});
