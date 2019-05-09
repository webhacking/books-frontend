describe('Partials GNB Test', function() {
  it('GNB', () => {
    cy.visit('/partials/gnb');
    cy.contains('로그인');
    // expect(true).to.equal(true);
  });
});
