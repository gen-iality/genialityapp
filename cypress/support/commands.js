//user register
Cypress.Commands.add('registerUser', ({ email, name, contrasena }) => {
  cy.get('[name=names]').type(name);
  cy.get('[name=email]').type(email);
  cy.get('[name=password]').type(contrasena);
  
});
