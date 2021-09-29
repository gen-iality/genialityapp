//Agregar Nueva organización
describe('new Organization', () => {
  const urleAddEvent = '/create-event/main';
  beforeEach(() => {
    cy.setCookie(
      'evius_token',
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjljZTVlNmY1MzBiNDkwMTFiYjg0YzhmYWExZWM1NGM1MTc1N2I2NTgiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiZXZpdXMgY28iLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZXZpdXNhdXRoIiwiYXVkIjoiZXZpdXNhdXRoIiwiYXV0aF90aW1lIjoxNjEyMjE4NTg4LCJ1c2VyX2lkIjoiNU14bXdEUlZ5MWRVTEczb1NraWdFMXNoaTd6MSIsInN1YiI6IjVNeG13RFJWeTFkVUxHM29Ta2lnRTFzaGk3ejEiLCJpYXQiOjE2MTIyMTg1ODgsImV4cCI6MTYxMjIyMjE4OCwiZW1haWwiOiJldml1c0Bldml1cy5jbyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImV2aXVzQGV2aXVzLmNvIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.OIzfsoY7Ai2Qf7O72gafYzI26i2PEr0__6TiyMV0ajhv8YGexNYnYT-y5Bq99pjAIQ2kRPVUyc4QghXz04NuTdWfZpVbOybsWwsFGUfeFpApt5GgFlrFeUliTGBoKocLDhuOoAr5rI_CF30gg-HltUBIZVU6DxPG9MWFS5cu03p9taF7_f5m88jp-JuqphshE0Su_LFA0WZqmP2_MOG3HmwGvmOAn9od_xUtOgF1wHwYlYnLWAsCjlYXbMMF16nTpr_DyP403mSKWskSGiDa2Z8nv0ctaC605Wn9eBtCxzi1B8JjKd5mSaRJUazNTndGg97Bhh7IOecdTvtBQYI9gA'
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
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjljZTVlNmY1MzBiNDkwMTFiYjg0YzhmYWExZWM1NGM1MTc1N2I2NTgiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiZXZpdXMgY28iLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZXZpdXNhdXRoIiwiYXVkIjoiZXZpdXNhdXRoIiwiYXV0aF90aW1lIjoxNjEyMjE4NTg4LCJ1c2VyX2lkIjoiNU14bXdEUlZ5MWRVTEczb1NraWdFMXNoaTd6MSIsInN1YiI6IjVNeG13RFJWeTFkVUxHM29Ta2lnRTFzaGk3ejEiLCJpYXQiOjE2MTIyMTg1ODgsImV4cCI6MTYxMjIyMjE4OCwiZW1haWwiOiJldml1c0Bldml1cy5jbyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImV2aXVzQGV2aXVzLmNvIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.OIzfsoY7Ai2Qf7O72gafYzI26i2PEr0__6TiyMV0ajhv8YGexNYnYT-y5Bq99pjAIQ2kRPVUyc4QghXz04NuTdWfZpVbOybsWwsFGUfeFpApt5GgFlrFeUliTGBoKocLDhuOoAr5rI_CF30gg-HltUBIZVU6DxPG9MWFS5cu03p9taF7_f5m88jp-JuqphshE0Su_LFA0WZqmP2_MOG3HmwGvmOAn9od_xUtOgF1wHwYlYnLWAsCjlYXbMMF16nTpr_DyP403mSKWskSGiDa2Z8nv0ctaC605Wn9eBtCxzi1B8JjKd5mSaRJUazNTndGg97Bhh7IOecdTvtBQYI9gA'
    );
    cy.visit(`${urleAddEvent}`);
  });
  it('create organization default', () => {
    const nameOrganizationNew = 'Jhon Smith';
    cy.get('#selectOrganization').type(nameOrganizationNew);
  });
});

//TEST SECCION NETWORKING
describe('search users networking', () => {
  const urleAddEvent = '/landing/5ea23acbd74d5c4b360ddde2/networking';
  beforeEach(() => {
    cy.setCookie(
      'evius_token',
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjljZTVlNmY1MzBiNDkwMTFiYjg0YzhmYWExZWM1NGM1MTc1N2I2NTgiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiZXZpdXMgY28iLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZXZpdXNhdXRoIiwiYXVkIjoiZXZpdXNhdXRoIiwiYXV0aF90aW1lIjoxNjEyMjE4NTg4LCJ1c2VyX2lkIjoiNU14bXdEUlZ5MWRVTEczb1NraWdFMXNoaTd6MSIsInN1YiI6IjVNeG13RFJWeTFkVUxHM29Ta2lnRTFzaGk3ejEiLCJpYXQiOjE2MTIyMTg1ODgsImV4cCI6MTYxMjIyMjE4OCwiZW1haWwiOiJldml1c0Bldml1cy5jbyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImV2aXVzQGV2aXVzLmNvIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.OIzfsoY7Ai2Qf7O72gafYzI26i2PEr0__6TiyMV0ajhv8YGexNYnYT-y5Bq99pjAIQ2kRPVUyc4QghXz04NuTdWfZpVbOybsWwsFGUfeFpApt5GgFlrFeUliTGBoKocLDhuOoAr5rI_CF30gg-HltUBIZVU6DxPG9MWFS5cu03p9taF7_f5m88jp-JuqphshE0Su_LFA0WZqmP2_MOG3HmwGvmOAn9od_xUtOgF1wHwYlYnLWAsCjlYXbMMF16nTpr_DyP403mSKWskSGiDa2Z8nv0ctaC605Wn9eBtCxzi1B8JjKd5mSaRJUazNTndGg97Bhh7IOecdTvtBQYI9gA'
    );
    cy.visit(`${urleAddEvent}`);
  });
  //Búsqueda sin parámetros networking
  it('search users networking', () => {
    const nameOrganizationNew = 'Jhon Smith';
    cy.wait(4000)
    //CAMBIA LA CANTIDAD DE USUARIOS PARA PASAR EL TEST
    cy.contains('Total: 233');
  });
  //Búsqueda con parámetros Networking
  it('search users networking with params', () => {
    const search = 'alcaldia@evius.co';
    cy.get('#inputSearch').type(search);
    cy.contains('Total: 1');
    cy.contains('Correo: alcaldia@evius.co');
  });
  //validar envío de solicitud de contacto sección Newtworking
  it('send friendShip contact', () => {
    const item = 'user-item-2';
    cy.get('#' + item)
      .contains('Enviar solicitud de Contacto')
      .click();
    cy.get('#' + item).contains('Confirmación pendiente');
  });
});

//Envío de solicitud de contacto en socialZone
describe('send friendShip in socialzone', () => {
  const urleAddEvent = '/landing/5ea23acbd74d5c4b360ddde2';
  beforeEach(() => {
    cy.setCookie(
      'evius_token',
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjljZTVlNmY1MzBiNDkwMTFiYjg0YzhmYWExZWM1NGM1MTc1N2I2NTgiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiZXZpdXMgY28iLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZXZpdXNhdXRoIiwiYXVkIjoiZXZpdXNhdXRoIiwiYXV0aF90aW1lIjoxNjEyMjE4NTg4LCJ1c2VyX2lkIjoiNU14bXdEUlZ5MWRVTEczb1NraWdFMXNoaTd6MSIsInN1YiI6IjVNeG13RFJWeTFkVUxHM29Ta2lnRTFzaGk3ejEiLCJpYXQiOjE2MTIyMTg1ODgsImV4cCI6MTYxMjIyMjE4OCwiZW1haWwiOiJldml1c0Bldml1cy5jbyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImV2aXVzQGV2aXVzLmNvIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.OIzfsoY7Ai2Qf7O72gafYzI26i2PEr0__6TiyMV0ajhv8YGexNYnYT-y5Bq99pjAIQ2kRPVUyc4QghXz04NuTdWfZpVbOybsWwsFGUfeFpApt5GgFlrFeUliTGBoKocLDhuOoAr5rI_CF30gg-HltUBIZVU6DxPG9MWFS5cu03p9taF7_f5m88jp-JuqphshE0Su_LFA0WZqmP2_MOG3HmwGvmOAn9od_xUtOgF1wHwYlYnLWAsCjlYXbMMF16nTpr_DyP403mSKWskSGiDa2Z8nv0ctaC605Wn9eBtCxzi1B8JjKd5mSaRJUazNTndGg97Bhh7IOecdTvtBQYI9gA'
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
    cy.contains('Asistentes', { force: true }).click({ force: true });
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
