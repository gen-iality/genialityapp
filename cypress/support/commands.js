Cypress.commands.add('registerUser', ({}) => {
  cy.get('[name=email]').type('fake@gmail.com');
  cy.contains('Registrar').click();
});
