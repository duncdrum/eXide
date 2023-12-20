describe('eXide initial run', () => {
  // {testIsolation: false} 
  beforeEach('load eXide', () => {
    // Go to eXide
    cy.visit('/index.html')
  })

  // TODO(DP) force clicking in L16 below should not be necessary
  // see #652
  it('should display welcome dialog in fresh browser', () => {
    cy.clearAllLocalStorage()
    cy.get('#dialog-startup')
      .should('be.visible')
      .contains('Getting Help')
      .parents("div.ui-dialog ").within(() => {
        cy.get("div.ui-dialog-buttonset button").click({ force: true })
      })
    cy.reload()
    cy.get('#dialog-startup')
      .should('not.be.visible')
  })

  // reload as local storage has been purged
  it('should just show new document', () => {
    cy.reload()
    cy.get('#dialog-startup')
      .should('not.be.visible')
    cy.get("#ui-id-1")
      .should('not.be.visible')
    cy.get('.ace_content')
      .contains('xquery version')
    cy.get('.path')
    cy.contains('__new__1')
      .should('be.visible')
  })

  // 
  it('should display version note', () => {
    cy.get("#ui-id-1")
      .should('be.visible')
      .contains('Version Note')
      .parents("div.ui-dialog ").within(() => {
        cy.get("div.ui-dialog-buttonset button").click()
      })
    cy.get("#ui-id-1")
      .should('not.be.visible')
  })
})