import { constructSearchDesc } from 'src/utils/books';

describe('constructSearchDesc', () => {
  it.each([
    [{
    }, ''],
    [{
      intro: 'intro',
      toc: 'toc',
    }, 'intro <목차> toc'],
    [{
      intro: 'intro',
      author: 'author',
      toc: 'toc',
    }, 'intro <저자 소개> author <목차> toc'],
    [{
      intro: 'intro',
      publisher_review: 'publisher',
    }, 'intro <출판사 서평> publisher'],
    [{
      publisher_review: 'publisher',
    }, '<출판사 서평> publisher'],
    [{
      intro: 'intro\r\nwith newline and &lt;angular brackets&gt;',
      toc: 'toc\r\nwith <b>tags</b> &amp; entities',
    }, 'intro with newline and <angular brackets> <목차> toc with tags & entities'],
  ])('should construct description correctly', (description, expected) => {
    expect(constructSearchDesc(description)).toBe(expected);
  });
});
