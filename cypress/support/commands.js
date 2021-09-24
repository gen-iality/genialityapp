//user register
Cypress.Commands.add(
  'registerUser',
  ({ email, name, phone, address, interested, economy_activity, description, termsService }) => {
    cy.get('[name=email]').type(email);
    cy.get('[name=names]').type(name);
    cy.get('[name=celularconcodigodearea]').type(phone);
    cy.get('[name=direccion]').type(address);
    cy.get('[name=interes]')
      .type(interested)
      .then(() => {
        cy.contains(interested).click({ force: true });
      });
    cy.get('[id=actividadeconomica]').type(economy_activity);
    cy.get('[id=descripcionemprendimiento]').type(description);
    termsService && cy.get('[name=aceptaciondeterminosycondiciones]').check();
    cy.contains('Registrar' || 'Register').click();
  }
);
