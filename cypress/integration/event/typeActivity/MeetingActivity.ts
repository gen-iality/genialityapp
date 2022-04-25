describe('Meeting activity', () => {
  const email = 'pruebascypress1@mocionsoft.com';

  const clave = 'mocion.2040';
  const uuid = () => Cypress._.random(0, 1e6);
  const id = uuid();

  it('it should create the event activity', () => {
    cy.visitEvent();
    cy.changeLogin();
    cy.login(email, clave);
    cy.wait(2000);
    cy.openUserMenu();
    cy.get('.ant-dropdown-menu-title-content')
      .eq(4)
      .click();
    cy.wait(2000);
    cy.get('.ant-steps-item-title').should('have.css', 'color', 'rgba(0, 0, 0, 0.85)');
    cy.get('input[name="name"]').type('Activity Cypress ' + id);
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
    cy.wait(10000);
    cy.scrollTo('top');
    cy.get('.ant-menu-submenu-title')
      .eq(2)
      .trigger('mouseover');
    cy.wait(2000);
    cy.get('li')
      .eq(8)
      .click();
    cy.wait(5000);
    cy.get('#removeAction0').click();
    cy.wait(1000);
    cy.get('button.ant-btn.ant-btn-default.ant-btn-dangerous').click();
    cy.wait(5000);
  });

  it('it should create meeting activity', () => {
    cy.visitEvent();
    cy.openUserMenu();
    cy.get('.ant-dropdown-menu-title-content')
      .eq(2)
      .click();
    cy.wait(6000);
    cy.get('.ant-card-actions')
      .eq(2)
      .click();
    cy.wait(8000);
    cy.scrollTo('top');
    cy.get('.ant-menu-submenu-title')
      .eq(2)
      .trigger('mouseover');
    cy.wait(2000);
    cy.get('li')
      .eq(8)
      .click();
    cy.wait(5000);
    cy.get('button.ant-btn.ant-btn-primary')
      .eq(0)
      .click();
    cy.wait(2000);
    cy.get('input[name="name"]').type('Actividad  Meeting Cypress ' + id);
    const filePath = 'cypress.jpg';
    cy.get("input[type='file']").attachFile(filePath);
    cy.wait(1000);
    cy.scrollTo('top');
    cy.get('button.ant-btn.ant-btn-primary').click();
    cy.wait(8000);
    cy.get('.ant-tabs-tab-btn')
      .eq(1)
      .click();
    cy.get('button.ant-btn.ant-btn-primary')
      .eq(1)
      .click();
    cy.wait(1000);
    cy.get('h3.ant-typography').should('exist');
    cy.get('.ant-ribbon-wrapper')
      .eq(1)
      .click();
    cy.wait(1000);
    cy.get('.ant-btn.ant-btn-primary')
      .eq(3)
      .click();
    cy.wait(1000);
    cy.get('.ant-btn.ant-btn-primary')
      .eq(3)
      .click();
    cy.wait(3000);
    cy.get('.ant-btn.ant-btn-primary')
      .eq(0)
      .invoke('attr', 'target', '')
      .click();
    cy.wait(8000);
    cy.get('.ant-page-header-heading-title').should('exist');
  });

  it('it should see the activity on the landing page', () => {
    cy.wait(2000);
    cy.get('.ant-btn.ant-btn-default.ant-btn-block').click();
    cy.get('.menuEvent_section-text')
      .eq(1)
      .invoke('attr', 'href')
      .then((href) => {
        cy.visit('https://staging.evius.co' + href);
      });
    cy.wait(10000);
    cy.get('.ant-card-body').should('exist');
    cy.get('.titulo').should('contain', 'Actividad  Meeting Cypress ' + id);
    cy.get('.ant-ribbon-wrapper')
      .eq(1)
      .click();
    cy.wait(4000);
  });
  it('should remove the activity type', () => {
    cy.openUserMenu();
    cy.get('.ant-dropdown-menu-title-content')
      .eq(2)
      .click();
    cy.wait(6000);
    cy.get('.ant-card-actions')
      .eq(2)
      .click();
    cy.wait(8000);
    cy.scrollTo('top');
    cy.get('.ant-menu-submenu-title')
      .eq(2)
      .trigger('mouseover');
    cy.wait(2000);
    cy.get('li')
      .eq(8)
      .click();
    cy.wait(2000);
    cy.get('button.ant-btn.ant-btn-primary.ant-btn-sm.ant-btn-icon-only')
      .eq(0)
      .click();
    cy.wait(4000);
    cy.get('.ant-tabs-tab-btn')
      .eq(1)
      .click();
    cy.get('#removeHeader').click();
    cy.wait(2000);
    cy.get('button.ant-btn.ant-btn-default.ant-btn-dangerous')
      .eq(1)
      .click();
    cy.wait(5000);
  });
  it('it should i remove the event', () => {
    cy.openUserMenu();
    cy.get('.ant-dropdown-menu-title-content')
      .eq(1)
      .click();
    cy.wait(6000);
    cy.get('.ant-card-actions')
      .eq(2)
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
