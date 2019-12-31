describe('Partials GNB Test', function() {
  it('GNB', () => {
    cy.visit('/partials/gnb');
    cy.contains('로그인');
    // expect(true).to.equal(true);
  });

  it('GNB 로그인 쿼리가 있을 경우', () => {
    cy.visit('/partials/gnb?is_login=true');
    cy.contains('내 서재');
    cy.contains('캐시충전');
  });
});
