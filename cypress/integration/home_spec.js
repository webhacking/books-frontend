import labels from '../../src/labels/instantSearch.json';

describe('Genre Home Test', function() {
  it('홈 방문이 가능', function() {
    cy.visit('/');
    cy.contains('Home');
    expect(true).to.equal(true);

    cy.viewport(700, 500);
    cy.contains('Home');
  });

  it('인스턴트 검색이 존재', () => {
    // cy.visit('/');
    cy.get('input')
      .should('have.attr', 'placeholder', labels.searchPlaceHolder)
      .click();
    cy.contains(labels.saveSearchHistory);
    cy.viewport(700, 500);
    cy.get('input')
      .should('have.attr', 'placeholder', labels.searchPlaceHolder)
      .click();
    cy.contains(labels.saveSearchHistory);
  });
});
