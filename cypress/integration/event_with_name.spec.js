const urltoVisit = '/landing/Reunión-Nacional-de-Ventas-2021';

describe('Show Data event with Name', () => {
  beforeEach(() => {
    cy.visit(urltoVisit);
  });

  it('Visit event with parameter name', () => {
    cy.get('[class=Chat-Event]').then(() => {
      cy.get('[id=button_open_menu]').click({ force: true });
    });
  });
});
