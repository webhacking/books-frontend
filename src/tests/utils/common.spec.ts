import { safeJSONParse, isJSON, getMaxDiscountPercentage } from '../../utils/common';

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

  it('올바른 할인율 반환', () => {
    const book = [
      {
        id: '425141571',
        thumbnailId: '425141571',
        title: '천재배우의 아우라Aura 10권',
        categories: [
          {
            id: 1713,
            name: '현대 판타지',
            genre: 'fantasy',
            sub_genre: 'fantasy',
            is_series_category: true,
          },
        ],
        price: {
          buy: { regular_price: 3200, price: 2880, discount_percentage: 10 },
        },
        unit: '권',
        series: {
          isSerial: false,
          isComplete: false,
          totalBookCount: 10,
          freeBookCount: 1,
          price_info: {
            buy: {
              total_book_count: 10,
              free_book_count: 1,
              regular_price: 28800,
              price: 25920,
              discount_percentage: 0,
            },
          },
        },
        authors: [{ name: '글술술', id: 101878, role: 'author' }],
        isComic: false,
        isNovel: false,
        isAdultOnly: false,
        isSomedeal: false,
        isWaitFree: false,
        isTrial: false,
        publisher: { id: 425, name: '문피아' },
      },
    ];
    // @ts-ignore
    const maxDiscount = getMaxDiscountPercentage(book[0]);

    expect(maxDiscount).toBe(10);
  });
});
