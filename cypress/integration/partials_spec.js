describe('Partials Component Test', function() {
  it('GNB', function() {
    cy.visit('/partials/gnb');
    cy.contains('로그인');
    // expect(true).to.equal(true);
  });
});
