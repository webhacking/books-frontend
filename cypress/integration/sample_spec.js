describe('My First Test', function() {
  it('Does not do much!', function() {
    cy.visit('');
    cy.contains('Home');
    expect(true).to.equal(true);
  });
});
