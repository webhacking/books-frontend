// eslint-disable-next-line
export const getEscapedString = (source: string) => {
  return source
    .replace(/</giu, '&lt;')
    .replace(/>/giu, '&gt;')
    .replace(/&lt;strong([^&]*)&gt;(.*?)&lt;\/strong&gt;/giu, '<strong$1>$2</strong>');
};
