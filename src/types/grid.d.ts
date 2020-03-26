export type MSGridRowAlignProperty = 'start' | 'end' | 'center' | 'stretch';
export type MSGridColumnAlignProperty = 'start' | 'end' | 'center' | 'stretch';

declare module 'csstype' {
  interface Properties {
    msGridRow?: number;
    '-ms-grid-row'?: number;

    msGridRowSpan?: number;
    '-ms-grid-row-span'?: number;

    msGridRowAlign?: MSGridRowAlignProperty;
    '-ms-grid-row-align'?: MSGridRowAlignProperty;

    msGridColumn?: number;
    '-ms-grid-column'?: number;

    msGridColumnSpan?: number;
    '-ms-grid-column-span'?: number;

    msGridColumnAlign?: MSGridColumnAlignProperty;
    '-ms-grid-column-align'?: MSGridColumnAlignProperty;
  }
}
