/// <reference types="cypress" />
describe('Create event', () => {
  const email = 'pruebascypress1@mocionsoft.com';
  const emailNoRegister = 'pruebascypress2@mocionsoft.com';
  const clave = 'mocion.2040';
  const uuid = () => Cypress._.random(0, 1e6);
  const id = uuid();
  const emailRegister = 'pruebascypress' + id + '@mocionsoft.com';

  it('it should create the event ', () => {
    cy.visitEvent();
    cy.changeLogin();
    cy.login(email, clave);
    cy.wait(2000);
    cy.get('.ant-dropdown-trigger')
      .eq(0)
      .trigger('mouseover');
    cy.get('.ant-dropdown-menu-item-group-title').should('exist');
    cy.wait(2000);
    cy.get('.ant-dropdown-menu-title-content')
      .eq(4)
      .click();
    cy.wait(2000);
    cy.get('.ant-steps-item-title').should('have.css', 'color', 'rgba(0, 0, 0, 0.85)');
    cy.get('input[name="name"]').type('Prueba Cypress' + id);
    cy.get('input[type="text"]')
      .eq(1)
      .click();
    cy.wait(2000);
    cy.get('.ant-modal-body').should('exist');
    cy.get('.DayPicker-Day')
      .eq(22)
      .click();
    cy.get('.ant-btn.ant-btn-primary')
      .eq(1)
      .click();
    cy.wait(2000);
    cy.get('.ant-btn.ant-btn-primary')
      .eq(0)
      .click();
    cy.wait(2000);
    cy.get('.ant-btn.ant-btn-primary')
      .eq(0)
      .click();
    cy.wait(2000);
  });
  it('should create registry parameters ', () => {
    cy.wait(5000);
    cy.scrollTo('top');
    cy.get('.ant-menu-submenu-title')
      .eq(3)
      .trigger('mouseover');
    cy.wait(2000);
    cy.get('li')
      .eq(8)
      .click();
    cy.wait(2000);
    //Cedula
    cy.get('.ant-btn.ant-btn-primary')
      .eq(2)
      .click();
    cy.wait(2000);
    cy.get('input[name="label"]')
      .eq(1)
      .type('Cédula');
    cy.get('.ant-select-selector').click();
    cy.wait(2000);
    cy.get('.ant-select-item.ant-select-item-option')
      .eq(6)
      .click();
    cy.get('#mandatoryModal').click();
    cy.get('#btnSave').click();
    cy.wait(3000);
    //Codigo de area
    cy.get('.ant-btn.ant-btn-primary')
      .eq(2)
      .click();
    cy.wait(2000);
    cy.get('input[name="label"]')
      .eq(1)
      .type('Codigo de area');
    cy.get('.ant-select-selector').click();
    cy.wait(2000);
    cy.get('.ant-select-item.ant-select-item-option')
      .eq(1)
      .click();
    cy.get('#mandatoryModal').click();
    cy.get('#btnSave').click();
    cy.wait(3000);
    // // Telefono
    cy.get('.ant-btn.ant-btn-primary')
      .eq(2)
      .click();
    cy.wait(2000);
    cy.get('input[name="label"]')
      .eq(1)
      .type('Telefono');
    cy.get('.ant-select-selector').click();
    cy.wait(2000);
    cy.get('.ant-select-item.ant-select-item-option')
      .eq(6)
      .click();
    cy.get('#mandatoryModal').click();
    cy.get('#btnSave').click();
    cy.wait(3000);
    //Pais
    cy.get('.ant-btn.ant-btn-primary')
      .eq(2)
      .click();
    cy.wait(2000);
    cy.get('input[name="label"]')
      .eq(1)
      .type('Pais');
    cy.get('.ant-select-selector').click();
    cy.wait(2000);
    cy.get('.ant-select-item.ant-select-item-option')
      .eq(2)
      .click();
    cy.get('#mandatoryModal').click();
    cy.get('#btnSave').click();
    cy.wait(3000);
    //Ciudad
    cy.get('.ant-btn.ant-btn-primary')
      .eq(2)
      .click();
    cy.wait(2000);
    cy.get('input[name="label"]')
      .eq(1)
      .type('Ciudad');
    cy.get('.ant-select-selector').click();
    cy.wait(2000);
    cy.get('.ant-select-item.ant-select-item-option')
      .eq(3)
      .click();
    cy.get('#mandatoryModal').click();

    cy.get('#btnSave').click();
    cy.wait(3000);
    //guardar evento
    cy.get('.ant-btn.ant-btn-primary')
      .eq(1)
      .click();
    cy.wait(5000);
    cy.get('.ant-btn.ant-btn-primary')
      .eq(0)
      .invoke('attr', 'target', '')
      .click();
    cy.wait(4000);
    cy.logoutWithEvent();
  });
  it('it must register in the event with the parameters when you are a new user', () => {
    cy.wait(4000);
    cy.registerUser(emailRegister, clave);
    cy.editRegistryInformation(emailRegister);
  });
  it('it must register in the event with the parameters when it is a user is already registered', () => {
    cy.wait(4000);
    cy.changeLoginEvent();
    cy.wait(1000);

    cy.get('input[type=email]')
      .eq(1)
      .type(emailNoRegister);
    cy.get('input[type=password]')
      .eq(0)
      .type(clave);
    cy.get('#loginButton').click();
    cy.wait(4000);
    cy.fillEventFields();
    cy.get("button[type='submit']").click();
    cy.editRegistryInformation(emailNoRegister);
  });
  it('it should i remove the event', () => {
    cy.visitEvent();
    cy.changeLogin();
    cy.login(email, clave);
    cy.wait(2000);
    cy.openUserMenu();
    cy.get('.ant-dropdown-menu-title-content')
      .eq(2)
      .click();
    cy.wait(6000);
    cy.get('.ant-card-actions')
      .eq(4)
      .click();
    cy.wait(5000);
    cy.scrollTo('top');
    cy.get('#removeHeader').click();
    cy.wait(2000);
    cy.get('button.ant-btn.ant-btn-default.ant-btn-dangerous').click();
    cy.wait(5000);
    cy.openUserMenu();
    cy.get('.ant-dropdown-menu-title-content')
      .eq(5)
      .click();
    cy.wait(1000);
    cy.get('button.ant-btn.ant-btn-default.ant-btn-dangerous').click();
    cy.wait(3000);
  });
});
