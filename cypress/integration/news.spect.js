const urlToTest = '/eventadmin/5ea23acbd74d5c4b360ddde2/news';

describe('Evius News', () => {
  beforeEach(() => {
    cy.setCookie('evius_token', 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyYWZkYjliOGJmZmMyY2M4ZTU4NGQ2ZWE2ODlmYzEwYTg3MGI2NzgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZXZpdXNhdXRoIiwiYXVkIjoiZXZpdXNhdXRoIiwiYXV0aF90aW1lIjoxNjMxNTM2MTQzLCJ1c2VyX2lkIjoiODFYdERvWExCUFRWdDRTNjNaMjRMMDVScGcwMyIsInN1YiI6IjgxWHREb1hMQlBUVnQ0UzYzWjI0TDA1UnBnMDMiLCJpYXQiOjE2MzE1MzYxNDMsImV4cCI6MTYzMTUzOTc0MywiZW1haWwiOiJhbGVqYW5kcmEucGVyZG9tb0Btb2Npb25zb2Z0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhbGVqYW5kcmEucGVyZG9tb0Btb2Npb25zb2Z0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.kiEu3rTdKRqnbmmgc8Xt8uPTGyAOUOGt06myJrHD3jicyRwhXVglWxoOLlqbWYizVVesV1YIVV6xFEyiH_JUZbB8JBB8lkCYVtfD1H-ubmQPy9dBzF699lcZ-HCrL_D-xQRwxaKRozzYpMIlhuChl_k6bcnzAFkmY8loBP6kNj9PT5tB9dYXCbNHrS6K0M7e2hcVlcSVSEmP6_0350ntZyJiKV9wnoadx1XWAfeKtCnI902JcIdquaZz5-r-FPkkhMOstX68F8Kx-9UvCdzZKydN1nFHwXeKJ1c6ZIMxJmpV9VIbYd3ou_iu92Uzj943QGG-uS0mcIMzdc9D5VX6UQ')
    cy.visit(`${urlToTest}`);
  });

  /* it('News Create', () => {
    cy.contains('Agregar').click()
    cy.get('[name=title]').type('¿Se puede ingresar a la parte de CMS?', {force: true}) 
    cy.get('[id=description_short]').type('Esta es una noticia corta')
    cy.get('[id=description_complete]').type('Esta es una noticia larga')
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
    cy.get('[name=linkYoutube]').type('¿Se puede ingresar a la parte de CMS?', {force: true}) 
    cy.get('[name=time]').type('2021-05-10', {force: true}) 
    cy.contains('Guardar').click()
  }); */

  /* it('News Edit', () => {
    cy.wait(250)
    cy.get('[id=editAction3]').click()
    cy.get('[name=title]').clear()
    cy.get('[id=description_short]').clear()
    cy.get('[id=description_complete]').clear()
    cy.get('[name=title]').type('Esta es una notica 2', {force: true})  
    cy.get('[id=description_short]').type('Esta es una noticia corta 2')
    cy.get('[id=description_complete]').type('Esta es una noticia larga 2')
    cy.contains('Guardar').click()
  }); */

  /* 

  it('News cancel remove in table', () => {
    cy.get('[id=removeAction3]').click()
    cy.contains('Cancelar').click()
  });
  
  it('News cancel remove in edit', () => {
    cy.get('[id=editarAction3]').click()
    cy.get('[id=removeHeader]').click()
    cy.contains('Cancelar').click()
  });

  it('News remove in table', () => {
    cy.get('[id=removeAction3]').click()
    cy.contains('Borrar').click()
  });

  it('News remove in edit', () => {
    cy.wait(4000)
    cy.get('[id=editarAction3]').click()
    cy.get('[id=removeHeader]').click()
    cy.contains('Borrar').click()
  }); */

});
