const urlToTest = '/eventadmin/5ea23acbd74d5c4b360ddde2/documents';

describe('Evius Documents', () => {
  beforeEach(() => {
    cy.setCookie('evius_token', 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyYWZkYjliOGJmZmMyY2M4ZTU4NGQ2ZWE2ODlmYzEwYTg3MGI2NzgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZXZpdXNhdXRoIiwiYXVkIjoiZXZpdXNhdXRoIiwiYXV0aF90aW1lIjoxNjMxNTM2MTQzLCJ1c2VyX2lkIjoiODFYdERvWExCUFRWdDRTNjNaMjRMMDVScGcwMyIsInN1YiI6IjgxWHREb1hMQlBUVnQ0UzYzWjI0TDA1UnBnMDMiLCJpYXQiOjE2MzE1MzYxNDMsImV4cCI6MTYzMTUzOTc0MywiZW1haWwiOiJhbGVqYW5kcmEucGVyZG9tb0Btb2Npb25zb2Z0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhbGVqYW5kcmEucGVyZG9tb0Btb2Npb25zb2Z0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.kiEu3rTdKRqnbmmgc8Xt8uPTGyAOUOGt06myJrHD3jicyRwhXVglWxoOLlqbWYizVVesV1YIVV6xFEyiH_JUZbB8JBB8lkCYVtfD1H-ubmQPy9dBzF699lcZ-HCrL_D-xQRwxaKRozzYpMIlhuChl_k6bcnzAFkmY8loBP6kNj9PT5tB9dYXCbNHrS6K0M7e2hcVlcSVSEmP6_0350ntZyJiKV9wnoadx1XWAfeKtCnI902JcIdquaZz5-r-FPkkhMOstX68F8Kx-9UvCdzZKydN1nFHwXeKJ1c6ZIMxJmpV9VIbYd3ou_iu92Uzj943QGG-uS0mcIMzdc9D5VX6UQ')
    cy.visit(`${urlToTest}`);
  });

  it('Documents Create', () => {
    cy.contains('Agregar').click()
    cy.get('[name=title]').type('Es un documentoaaa', {force: true}) 
    cy.fixture('BOTON_STANDS.png').then(fileContent => {
      cy.get('input[type="file"]').attachFile({
          fileContent: fileContent.toString(),
          fileName: 'BOTON_STANDS.png',
          mimeType: 'image/png'
      });
    });
    cy.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false
    })
    cy.wait(600)
    cy.contains('Guardar').click()
  });

  it('Documents Edit', () => {
    cy.get('[id=editAction0]').click()
    cy.get('[name=title]').clear()
    cy.get('[name=title]').type('Es un documento 2', {force: true}) 
    cy.fixture('BOTON_STANDS.png').then(fileContent => {
      cy.get('input[type="file"]').attachFile({
          fileContent: fileContent.toString(),
          fileName: 'BOTON_STANDS.png',
          mimeType: 'image/png'
      });
    });
    cy.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false
    })
    cy.wait(600)
    cy.contains('Guardar').click()
  });

  it('Documents cancel remove in table', () => {
    cy.get('[id=removeAction0]').click()
    cy.contains('Cancelar').click()
  });
  
  it('Documents cancel remove in edit', () => {
    cy.get('[id=editAction0]').click()
    cy.get('[id=removeHeader]').click()
    cy.contains('Cancelar').click()
  });

  it('Documents remove in table', () => {
    cy.get('[id=removeAction0]').click()
    cy.contains('Borrar').click()
  });

  it('Documents remove in edit', () => {
    cy.get('[id=editAction0]').click()
    cy.get('[id=removeHeader]').click()
    cy.contains('Borrar').click()
  });

  it('Documents Download', () => {
    cy.get('[id=downloadAction0]').click()
  })
});
