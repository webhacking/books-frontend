// temporary use

const genres = {
  fantasy: '판타지 단행본',
  'fantasy-serial': '판타지 연재',
  bl: 'BL 단행본',
  'bl-serial': 'BL 연재',
  romance: '로맨스 단행본',
  'romance-serial': '로맨스 연재',
  comics: '만화',
  general: '일반장르',
};

export default (genre: string) => {
  if (genre === '' || genre === 'comics') {
    return genres[genre];
  }
  return `${genres[genre]}`;
};
