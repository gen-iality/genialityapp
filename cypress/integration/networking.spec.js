//Agregar Nueva organización
describe('new Organization', () => {
    it('create new organization', () => {
      const nameOrganizationNew = 'organizacionEvius.co';
      const urleAddEvent ='/create-event/main?token='+tokenPrueba;
      cy.visit(`${urleAddEvent}`);
      cy.get('#addOrganization').click();
      cy.get('#nameOrganizer').type(nameOrganizationNew);
      cy.get('#addOrganizers').click();
      cy.get('#selectOrganization').type(nameOrganizationNew);
    });
  });
  
  //Agregar Organización por defecto
  describe('new Organization default', () => {
    it('create organization default', () => {
      const nameOrganizationNew = 'Jhon Smith';
      const urleAddEvent ='/create-event/main?token='+tokenPrueba;
      cy.visit(`${urleAddEvent}`);    
      cy.get('#selectOrganization').type(nameOrganizationNew);
    });
  });
  //
  
  //Búsqueda sin parámetros networking
  describe('search users', () => {
    it('search users networking', () => {
      const nameOrganizationNew = 'Jhon Smith';
      const urleAddEvent ='/landing/5ea23acbd74d5c4b360ddde2/networking?token='+tokenPrueba;
      cy.visit(`${urleAddEvent}`);
      cy.contains("Total: 227")
    });
  });
  
  //Búsqueda con parámetros Networking
  describe('search users', () => {
    it('search users networking with params', () => {
      const search = 'alcaldia@evius.co';
      const urleAddEvent ='/landing/5ea23acbd74d5c4b360ddde2/networking?token='+tokenPrueba;
      cy.visit(`${urleAddEvent}`);
      cy.get('#inputSearch').type(search);
      cy.contains("Total: 1");
      cy.contains('Correo: alcaldia@evius.co');
    });
  });
  
  //validar envío de solicitud de contacto sección Newtworking
  describe('send friendShip', () => {
    it('send friendShip contact', () => {
      const item = 'user-item-2';
      const urleAddEvent ='/landing/5ea23acbd74d5c4b360ddde2/networking?token='+tokenPrueba;
      cy.visit(`${urleAddEvent}`); 
      cy.get("#"+item).contains('Enviar solicitud de Contacto').click();
      cy.get("#"+item).contains('Confirmación pendiente');
     });
  });
  
  //Envío de solicitud de contacto en socialZone
  describe.only('send friendShip in socialzone', () => {
    it('send friendShip contact socialZone', () => {  
      const item='#popover5f11bd670da32b2aac459042';
      const urleAddEvent ='/landing/5ea23acbd74d5c4b360ddde2?token='+tokenPrueba;
      cy.visit(`${urleAddEvent}`);    
      cy.get('#openMenu').scrollIntoView().click({force: true})
      //Esperamos que se realice la petición
      cy.wait(3000)
      cy.contains('Asistentes',{force: true}).click({force: true})
      cy.get('.ant-list-item-meta-title').first().trigger('mouseover'); 
      cy.get('.anticon-usergroup-add').click();
      //Esperamos que se realice la petición
      cy.wait(1000)
      //Comprobamos si se bloquea el botón al enviar la solicitud
      cy.get('.anticon-usergroup-add').should('have.css','color','rgb(128, 128, 128)');
     });
  });