const urlToTest = '/event/5ea23acbd74d5c4b360ddde2/speakers';

describe('Evius Speaker', () => {
  beforeEach(() => {
    cy.setCookie('evius_token', 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyYWZkYjliOGJmZmMyY2M4ZTU4NGQ2ZWE2ODlmYzEwYTg3MGI2NzgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZXZpdXNhdXRoIiwiYXVkIjoiZXZpdXNhdXRoIiwiYXV0aF90aW1lIjoxNjMxNTM2MTQzLCJ1c2VyX2lkIjoiODFYdERvWExCUFRWdDRTNjNaMjRMMDVScGcwMyIsInN1YiI6IjgxWHREb1hMQlBUVnQ0UzYzWjI0TDA1UnBnMDMiLCJpYXQiOjE2MzE1MzYxNDMsImV4cCI6MTYzMTUzOTc0MywiZW1haWwiOiJhbGVqYW5kcmEucGVyZG9tb0Btb2Npb25zb2Z0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhbGVqYW5kcmEucGVyZG9tb0Btb2Npb25zb2Z0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.kiEu3rTdKRqnbmmgc8Xt8uPTGyAOUOGt06myJrHD3jicyRwhXVglWxoOLlqbWYizVVesV1YIVV6xFEyiH_JUZbB8JBB8lkCYVtfD1H-ubmQPy9dBzF699lcZ-HCrL_D-xQRwxaKRozzYpMIlhuChl_k6bcnzAFkmY8loBP6kNj9PT5tB9dYXCbNHrS6K0M7e2hcVlcSVSEmP6_0350ntZyJiKV9wnoadx1XWAfeKtCnI902JcIdquaZz5-r-FPkkhMOstX68F8Kx-9UvCdzZKydN1nFHwXeKJ1c6ZIMxJmpV9VIbYd3ou_iu92Uzj943QGG-uS0mcIMzdc9D5VX6UQ')
    cy.visit(`${urlToTest}`);
  });

  /* it('Speaker Create', () => {
    cy.contains('Agregar').click()
    cy.get('[name=published]').click()
    cy.get('[name=name]').type('Margarita Gonzalez')
    cy.get('[name=profession]').type('Analista de Testeo')
    cy.get('[name=published]').click()
    cy.contains('Guardar').click()
  });

  it('Speaker Edit', () => {
    cy.get('[id=editarTest0]').click()
    cy.get('[name=published]').click()
    cy.get('[name=name]').clear()
    cy.get('[name=profession]').clear()
    cy.get('[name=name]').type('Gonzalez')
    cy.get('[name=profession]').type('Analista')
    cy.contains('Guardar').click()
  });

  it('Speaker Edit Published', () => {
    cy.get('[id=editSwitch0]').click()
  }); */

  /* it('Speaker remove in table', () => {
    cy.get('[id=remove0]').click()
    cy.contains('Borrar').click()
    cy.contains('Cancelar').click()
  }); */
  
  /* it('Speaker remove in edit', () => {
    cy.get('[id=editarTest0]').click()
    cy.get('[id=removeHeader]').click()
    cy.contains('Borrar').click()
    cy.contains('Cancelar').click()
  }); */

  /* it('Speaker back in create', () => {
    cy.contains('Agregar').click()
    cy.get('[id=goBack]').click()
  }); */

  /* it('Speaker back in edit', () => {
    cy.get('[id=editarTest0]').click()
    cy.get('[id=goBack]').click()
  }); */

  /* it('Speaker go to category', () => {
    cy.contains('Agregar').click()
    cy.get('[id=goToCategory]').click()
    //cy.get('[id=goBack]').click()
    //cy.get('[id=goBack]').click()
  }) */
  
  /* //No funciona
  it('Speaker draggable', () => {
    cy.get('[id=drag0]').trigger("dragstart").trigger("dragleave")

    cy.get('[id=drag1]')
     .trigger("dragenter")
     .trigger("dragover")
     .trigger("drop")
     .trigger("dragend");
  }) */

  /* it('Speaker Search Name', () => {
    cy.get('[id=searchIconname]').click()
    cy.get('[id=searchname]').type('Prueba')
    cy.contains('Buscar').click()
    cy.get('[id=searchIconname]').click()
    cy.contains('Borrar').click()
  }) */

  /* it('Speaker Search Profession', () => {
    cy.get('[id=searchIconprofession]').click()
    cy.get('[id=searchprofession]').type('Prueba')
    cy.contains('Buscar').click()
    cy.get('[id=searchIconprofession]').click()
    cy.contains('Borrar').click()
  }) */
});
