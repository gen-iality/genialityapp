///<reference types="cypress" />

describe('Logout Action', () => {
  it('Deberia mostra el menu del usuario', () => {
    cy.visit('http://localhost:3000/');
    cy.contains('Eventos');
    cy.get('.ant-dropdown-trigger')
      .eq(0)
      .trigger('mouseover');
    cy.contains('Administración').should('exist');
    cy.contains('Cerrar sesión').click();
    cy.contains('Si, cerrar la sesión').click();
  });
});
