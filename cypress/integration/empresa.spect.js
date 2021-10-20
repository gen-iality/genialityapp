const urlToTest = '/eventadmin/5ea23acbd74d5c4b360ddde2/empresas';

describe('Evius Empresa', () => {
  beforeEach(() => {
    cy.setCookie('evius_token', 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyYWZkYjliOGJmZmMyY2M4ZTU4NGQ2ZWE2ODlmYzEwYTg3MGI2NzgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZXZpdXNhdXRoIiwiYXVkIjoiZXZpdXNhdXRoIiwiYXV0aF90aW1lIjoxNjMxNTM2MTQzLCJ1c2VyX2lkIjoiODFYdERvWExCUFRWdDRTNjNaMjRMMDVScGcwMyIsInN1YiI6IjgxWHREb1hMQlBUVnQ0UzYzWjI0TDA1UnBnMDMiLCJpYXQiOjE2MzE1MzYxNDMsImV4cCI6MTYzMTUzOTc0MywiZW1haWwiOiJhbGVqYW5kcmEucGVyZG9tb0Btb2Npb25zb2Z0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhbGVqYW5kcmEucGVyZG9tb0Btb2Npb25zb2Z0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.kiEu3rTdKRqnbmmgc8Xt8uPTGyAOUOGt06myJrHD3jicyRwhXVglWxoOLlqbWYizVVesV1YIVV6xFEyiH_JUZbB8JBB8lkCYVtfD1H-ubmQPy9dBzF699lcZ-HCrL_D-xQRwxaKRozzYpMIlhuChl_k6bcnzAFkmY8loBP6kNj9PT5tB9dYXCbNHrS6K0M7e2hcVlcSVSEmP6_0350ntZyJiKV9wnoadx1XWAfeKtCnI902JcIdquaZz5-r-FPkkhMOstX68F8Kx-9UvCdzZKydN1nFHwXeKJ1c6ZIMxJmpV9VIbYd3ou_iu92Uzj943QGG-uS0mcIMzdc9D5VX6UQ')
    cy.visit(`${urlToTest}`);
  });

  it('Empresa Create', () => {
    cy.wait(4000)
    cy.contains('Agregar').click()
    cy.wait(500)
    cy.get('[name=name]').type('Empresa Prueba') 
    cy.get('[name=video_url]').type('www.url.com')
    cy.fixture('cert.png').as('cert')
    cy.fixture('BOTON_STANDS.png').as('logo')
    cy.get('input[type=file]').then(function (el) {
      const blob = Cypress.Blob.base64StringToBlob(this.logo, 'image/png')
    
      const file = new File([blob], this.logo, { type: 'image/png' })
      const list = new DataTransfer()
    
      list.items.add(file)
      const myFileList = list.files
    
      el[0].files = myFileList
      el[0].dispatchEvent(new Event('change', { bubbles: true }))
    })
    cy.get('[name=telefono]').type('123-456-7899')
    cy.get('[name=email]').type('empresa@gmail.com')
    
    cy.contains('Guardar').click()
  });

  it('Empresa cancel remove in table', () => {
    cy.wait(4000)
    cy.get('[id=removeAction1]').click()
    cy.contains('Cancel').click()
  });
  
  it('Empresa remove in table', () => {
    cy.wait(5000)
    cy.get('[id=removeAction1]').click()
    cy.contains('Borrar').click()
  });

  it('Empresa Configuration', () => {
    cy.wait(4000)
    cy.get('[id=configuration]').click()
    cy.wait(500)
    cy.contains('Guardar').click()
  });
});
