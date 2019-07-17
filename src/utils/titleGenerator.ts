// temporary use

const genres = {
  fantasy: '판타지',
  general: '일반도서',
  bl: 'BL',
  romance: '로맨스',
  comic: '만화',
};

const subServices = {
  single: '단행본',
  serial: '연재',
};

// @ts-ignore
export default (genre: string, subService: string) => {
  if (genre === 'general' || genre === 'comic') {
    return genres[genre];
  }

  // @ts-ignore
  return `${genres[genre]} ${subServices[subService]}`;
};
