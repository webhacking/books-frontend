import labels from '../../src/labels/instantSearch.json';

describe('Genre Home Test', function() {
  it('홈 방문이 가능', function() {
    cy.visit('/');
    cy.contains('일반');
    cy.contains('로맨스');
    // cy.viewport(700, 500);
  });

  // it('인스턴트 검색이 존재', () => {
  //   cy.get('input')
  //     .should('have.attr', 'placeholder', labels.searchPlaceHolder)
  //     .click();
  //
  //   cy.viewport(700, 500);
  //   cy.get('input')
  //     .should('have.attr', 'placeholder', labels.searchPlaceHolder)
  //     .click();
  // });
  //
  // it('검색 히스토리 목록 표시', () => {
  //   cy.clearLocalStorage();
  //   cy.get('input')
  //     .click()
  //     .type('{enter}');
  //   cy.viewport(700, 500);
  //   cy.wait(250);
  //   cy.get('input')
  //     .should('have.attr', 'placeholder', labels.searchPlaceHolder)
  //     .click()
  //     .type('test{enter}');
  //   cy.wait(250);
  //   cy.get('input').clear();
  //   cy.contains(labels.turnOffSearchHistory);
  //   cy.contains(labels.clearSearchHistory);
  //   cy.contains(labels.turnOffSearchHistory).click();
  //   cy.contains(labels.turnOffStatus);
  //   cy.contains(labels.turnOnSearchHistory).click();
  //   cy.contains(labels.clearSearchHistory).click();
  // });
});
