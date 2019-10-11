import { safeJSONParse, isJSON } from '../../utils/common';

describe('test common utilities', () => {
  it('should be return default value', () => {
    const result = safeJSONParse('maybe error be with you', 'default');
    expect(result).toBe('default');
  });
  it('should be return default value - 2', () => {
    // @ts-ignore
    const result = safeJSONParse(null, true);
    expect(result).toBe(true);
  });

  it('should be return correct value', () => {
    const result = safeJSONParse('["ok"]', '');
    expect(result[0]).toBe('ok');
  });

  it('should be return true', () => {
    const result = isJSON('{"key": "value"}');
    expect(result).toBe(true);
  });
  it('should be return false', () => {
    const result = isJSON('{error: "json"}');
    expect(result).toBe(false);
  });
});
