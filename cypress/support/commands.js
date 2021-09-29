//user register
Cypress.Commands.add(
  'registerUser',
  ({ email, name, contrasena }) => {
    cy.get('[name=email]').type(email);
    cy.get('[name=names]').type(name);
    //cy.get('[name=celularconcodigodearea]').type(phone);
    //cy.get('[name=direccion]').type(address);
    //cy.get('[name=interes]')
    cy.get('[name=password]').type(contrasena);
    
   // cy.get('[id=actividadeconomica]').type(economy_activity);
    //cy.get('[id=descripcionemprendimiento]').type(description);
    //termsService && cy.get('[name=aceptaciondeterminosycondiciones]').check();
   
  });
