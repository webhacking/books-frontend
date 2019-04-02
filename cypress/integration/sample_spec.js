describe('My First Test', function() {
  it('Does not do much!', function() {
    cy.visit('');
    cy.contains('Home');
    expect(true).to.equal(true);
  });
  // it('Intentional Error!', () => {
  //   cy.visit('');
  //   cy.contains('Strange Victory!, Strange Defeat!');
  //   expect(true).to.equal(false);
  // });
});
