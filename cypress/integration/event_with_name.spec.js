const urltoVisit = '/events';

describe('Show Data event with Name', () => {
  beforeEach(() => {
    cy.visit(urltoVisit);
  });

  it('Visit event with parameter name', () => {
    cy.contains('Eventos').then(() => {
      cy.get('[id=go_to_activity]').click({ multiple: true });
    });
    // cy.get('[class=Chat-Event]').then(() => {
    //   cy.get('[id=button_open_menu]').click({ force: true });
    // });
  });
});
