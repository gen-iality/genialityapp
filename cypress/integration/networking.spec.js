//Agregar Nueva organización
describe('new Organization', () => {
  const urleAddEvent = '/create-event/main';
  beforeEach(() => {
    cy.setCookie(
      'evius_token',
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjYxMDgzMDRiYWRmNDc1MWIyMWUwNDQwNTQyMDZhNDFkOGZmMWNiYTgiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiamFpbWVTdHVkZW50IiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2V2aXVzYXV0aCIsImF1ZCI6ImV2aXVzYXV0aCIsImF1dGhfdGltZSI6MTYxMzM0MDQ2MCwidXNlcl9pZCI6ImJHZkJPRmZkZDNhS3dXSWlrbHBqNDhrbnY3RTMiLCJzdWIiOiJiR2ZCT0ZmZGQzYUt3V0lpa2xwajQ4a252N0UzIiwiaWF0IjoxNjEzMzQwNDYwLCJleHAiOjE2MTMzNDQwNjAsImVtYWlsIjoiamFpbWVkYW5pZWwuYm05MUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiamFpbWVkYW5pZWwuYm05MUBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.Pv2OMoDPraXrlKQG_otYY8SKUmvXjfsojrI8tUkgMJD4fTRNFcFWI-dIrWVyAX3jNckrwwySpY6J6FFAsc3gqli67Bv_9hAE39d25vqdecZsX0HB7P-iYqiK3IRvnR-WcZq-WiwVWq54KHbkKo8-WHL-XFfyXzFYPD_8xyAGvWJxI48sFij9bpEjLbn82JY3BFI4akzIzbkpt5XVg_ZtnA0HwqbVxng47Tc1O3AWWWY_H-PrAxdTOuRZfhRujTo-alO7XL8B3utsBDUTY8PXone0hGcqHshRCv7m9qV2xUlt13oIeI6OvpskcQ0BiDux1W3pfnYEQFhxWlefQNZHMw'
    );
    cy.visit(`${urleAddEvent}`);
  });
  it('create new organization', () => {
    const nameOrganizationNew = 'organizacionEvius.co';
    cy.wait(2000)
    cy.get('#addOrganization').click();
    cy.get('#nameOrganizer').type(nameOrganizationNew);
    cy.get('#addOrganizers').click();
    cy.wait(2000)
    cy.get('#selectOrganization').type(nameOrganizationNew);
  });
});

//Agregar Organización por defecto
describe('new Organization default', () => {
  const urleAddEvent = '/create-event/main';
  beforeEach(() => {
    cy.setCookie(
      'evius_token',
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjYxMDgzMDRiYWRmNDc1MWIyMWUwNDQwNTQyMDZhNDFkOGZmMWNiYTgiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiamFpbWVTdHVkZW50IiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2V2aXVzYXV0aCIsImF1ZCI6ImV2aXVzYXV0aCIsImF1dGhfdGltZSI6MTYxMzM0MDQ2MCwidXNlcl9pZCI6ImJHZkJPRmZkZDNhS3dXSWlrbHBqNDhrbnY3RTMiLCJzdWIiOiJiR2ZCT0ZmZGQzYUt3V0lpa2xwajQ4a252N0UzIiwiaWF0IjoxNjEzMzQwNDYwLCJleHAiOjE2MTMzNDQwNjAsImVtYWlsIjoiamFpbWVkYW5pZWwuYm05MUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiamFpbWVkYW5pZWwuYm05MUBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.Pv2OMoDPraXrlKQG_otYY8SKUmvXjfsojrI8tUkgMJD4fTRNFcFWI-dIrWVyAX3jNckrwwySpY6J6FFAsc3gqli67Bv_9hAE39d25vqdecZsX0HB7P-iYqiK3IRvnR-WcZq-WiwVWq54KHbkKo8-WHL-XFfyXzFYPD_8xyAGvWJxI48sFij9bpEjLbn82JY3BFI4akzIzbkpt5XVg_ZtnA0HwqbVxng47Tc1O3AWWWY_H-PrAxdTOuRZfhRujTo-alO7XL8B3utsBDUTY8PXone0hGcqHshRCv7m9qV2xUlt13oIeI6OvpskcQ0BiDux1W3pfnYEQFhxWlefQNZHMw'
    );
    cy.visit(`${urleAddEvent}`);
  });
  it('create organization default', () => {
    const nameOrganizationNew = 'Jhon Smith';
    cy.wait(4000)
    cy.get('#selectOrganization').type(nameOrganizationNew);
  });
});

//TEST SECCION NETWORKING
describe('search users networking', () => {
  const urleAddEvent = '/landing/5ea23acbd74d5c4b360ddde2/networking';
  beforeEach(() => {
    cy.setCookie(
      'evius_token',
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjYxMDgzMDRiYWRmNDc1MWIyMWUwNDQwNTQyMDZhNDFkOGZmMWNiYTgiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiamFpbWVTdHVkZW50IiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2V2aXVzYXV0aCIsImF1ZCI6ImV2aXVzYXV0aCIsImF1dGhfdGltZSI6MTYxMzM0MDQ2MCwidXNlcl9pZCI6ImJHZkJPRmZkZDNhS3dXSWlrbHBqNDhrbnY3RTMiLCJzdWIiOiJiR2ZCT0ZmZGQzYUt3V0lpa2xwajQ4a252N0UzIiwiaWF0IjoxNjEzMzQwNDYwLCJleHAiOjE2MTMzNDQwNjAsImVtYWlsIjoiamFpbWVkYW5pZWwuYm05MUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiamFpbWVkYW5pZWwuYm05MUBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.Pv2OMoDPraXrlKQG_otYY8SKUmvXjfsojrI8tUkgMJD4fTRNFcFWI-dIrWVyAX3jNckrwwySpY6J6FFAsc3gqli67Bv_9hAE39d25vqdecZsX0HB7P-iYqiK3IRvnR-WcZq-WiwVWq54KHbkKo8-WHL-XFfyXzFYPD_8xyAGvWJxI48sFij9bpEjLbn82JY3BFI4akzIzbkpt5XVg_ZtnA0HwqbVxng47Tc1O3AWWWY_H-PrAxdTOuRZfhRujTo-alO7XL8B3utsBDUTY8PXone0hGcqHshRCv7m9qV2xUlt13oIeI6OvpskcQ0BiDux1W3pfnYEQFhxWlefQNZHMw'
    );
    cy.visit(`${urleAddEvent}`);
  });
  //Búsqueda sin parámetros networking
  it('search users networking', () => {
    const nameOrganizationNew = 'Jhon Smith';
    cy.wait(4000)
    //CAMBIA LA CANTIDAD DE USUARIOS PARA PASAR EL TEST
    cy.contains('Enviar solicitud de contacto');
  });
  //Búsqueda con parámetros Networking
  it('search users networking with params', () => {
    cy.wait(4000)
    const search = 'alcaldia@evius.co';
    cy.get('#inputSearch').type(search, { force: true });
    cy.contains('Total: 1');
    cy.contains('Correo: alcaldia@evius.co');
  });
  //validar envío de solicitud de contacto sección Newtworking
  it('send friendShip contact', () => {
    cy.wait(6000)
    //cambiar indices para comprobar envio de solicitud de contacto o comentar el envío de solicitud
    const index=4;
    const item = 'user-item-'+index;
    /*cy.get('#' + item)
      .contains('Enviar solicitud de contacto')
      .click({force: true} );*/
    cy.get('#' + item).contains('Enviar solicitud de contacto');
  });
});

//Envío de solicitud de contacto en socialZone
describe('send friendShip in socialzone', () => {
  const urleAddEvent = '/landing/5ea23acbd74d5c4b360ddde2';
  beforeEach(() => {
    cy.setCookie(
      'evius_token',
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjYxMDgzMDRiYWRmNDc1MWIyMWUwNDQwNTQyMDZhNDFkOGZmMWNiYTgiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiamFpbWVTdHVkZW50IiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2V2aXVzYXV0aCIsImF1ZCI6ImV2aXVzYXV0aCIsImF1dGhfdGltZSI6MTYxMzM0MDQ2MCwidXNlcl9pZCI6ImJHZkJPRmZkZDNhS3dXSWlrbHBqNDhrbnY3RTMiLCJzdWIiOiJiR2ZCT0ZmZGQzYUt3V0lpa2xwajQ4a252N0UzIiwiaWF0IjoxNjEzMzQwNDYwLCJleHAiOjE2MTMzNDQwNjAsImVtYWlsIjoiamFpbWVkYW5pZWwuYm05MUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiamFpbWVkYW5pZWwuYm05MUBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.Pv2OMoDPraXrlKQG_otYY8SKUmvXjfsojrI8tUkgMJD4fTRNFcFWI-dIrWVyAX3jNckrwwySpY6J6FFAsc3gqli67Bv_9hAE39d25vqdecZsX0HB7P-iYqiK3IRvnR-WcZq-WiwVWq54KHbkKo8-WHL-XFfyXzFYPD_8xyAGvWJxI48sFij9bpEjLbn82JY3BFI4akzIzbkpt5XVg_ZtnA0HwqbVxng47Tc1O3AWWWY_H-PrAxdTOuRZfhRujTo-alO7XL8B3utsBDUTY8PXone0hGcqHshRCv7m9qV2xUlt13oIeI6OvpskcQ0BiDux1W3pfnYEQFhxWlefQNZHMw'
    );
    cy.visit(`${urleAddEvent}`);
  });
  it('send friendShip contact socialZone', () => {
    const item = '#popover5f11bd670da32b2aac459042';
    cy.wait(3000);
    cy.get('#openMenu')
      .scrollIntoView()
      .click({ force: true });
    //Esperamos que se realice la petición
    cy.wait(3000);
    cy.get('#rc-tabs-1-tab-2', { force: true }).click({ force: true });
    cy.get('.ant-list-item-meta-title')
      .first()
      .trigger('mouseover');
    cy.get('.anticon-usergroup-add').click();
    //Esperamos que se realice la petición
    cy.wait(3000);
    //Comprobamos si se bloquea el botón al enviar la solicitud
    cy.get('.anticon-usergroup-add').should('have.css', 'color', 'rgb(128, 128, 128)');
  });
});
