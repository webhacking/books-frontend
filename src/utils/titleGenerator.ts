// temporary use

const genres = {
  fantasy: '판타지',
  general: '일반도서',
  bl: 'BL',
  romance: '로맨스',
  comics: '만화',
};

const subServices = {
  single: '단행본',
  serial: '연재',
};

export default (genre: string, subService: string) => {
  if (genre === 'general' || genre === 'comics') {
    return genres[genre];
  }
  return `${genres[genre]} ${subServices[subService]}`;
};
