import { Author, SearchBookDetail } from 'src/types/searchResults';

export interface SearchResult {
  books: SearchBookDetail[];
  authors: Author[];
}
