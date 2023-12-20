const indexPage = 'http://localhost:8080/exist/apps/eXide/index.html'
const loginPage = 'http://localhost:8080/exist/apps/eXide/login.html'

// TODO(DP) make sure the assertion match the description of whats under test
// TODO(DP) disentangle:
//   - group guest and admin users
//   - probably split
//   - make visits dryer and less redundant
//   - add negative tests
// 
describe('with guest=yes (default)', () => {
    before(() => {
        cy.setConf(true, true);
    })

    describe('as guest user', () => {
        it('login page should redirect guest to index.html', () => {
            cy.visit('/login.html')
            cy.url().should('eq', indexPage)
        })

        it('index page should show editor', () => {
            cy.visit('/index.html')
            cy.url().should('eq', indexPage)
        })
    })

    describe('as admin user', () => {
        it('login page should redirect admin to index.html', () => {
            cy.loginXHR('admin', '')
            cy.visit('/login.html')
            cy.url().should('eq', indexPage)
        })

        it('index page should show editor', () => {
            cy.loginXHR('admin', '')
            cy.visit('/index.html')
            cy.url().should('eq', indexPage)
        })

        it('reload after logout still shows editor', () => {
            cy.loginXHR('guest', 'guest')
            cy.visit('/index.html')
            cy.url().should('eq', indexPage)
        })
    })
})

describe('with guest=no', () => {
    before(() => {
        cy.setConf(true, false);
    })
    after(() => {
        cy.setConf(true, true);
    })

    describe('as guest', () => {
        before(() => { cy.loginXHR('guest', 'guest') })
        it('login page should show', () => {
            cy.visit('/login.html')
            // cy.reload(true)
            cy.url().should('eq', loginPage)
        })

        it('index page should redirect to login', () => {
            cy.visit('/index.html')
            cy.url().should('eq', loginPage)
        })
    })

    describe('as admin', () => {
        it('login page should redirect admin to index.html', () => {
            cy.loginXHR('admin', '')
            cy.visit('/login.html')
            cy.url().should('eq', indexPage)
        })

        it('index page should show editor', () => {
            cy.loginXHR('admin', '')
            cy.visit('/index.html')
            cy.url().should('eq', indexPage)
        })
    })
})

describe('login using form', () => {
    before(() => {
        cy.setConf(true, false);
    })
    beforeEach(() => {
        cy.loginXHR('guest', 'guest')
    })
    after(() => {
        cy.setConf(true, true);
        cy.loginXHR('guest', 'guest')
    })

    it('login page should show', () => {
        cy.visit('/login.html')
        cy.url().should('eq', loginPage)
    })

    describe('with valid admin credentials', () => {
        it('should login in', () => {
            cy.session(['form', 'admin', ''], () => {
                cy.visit('/login.html')
                cy.get('[name=user]').type('admin')
                cy.get('[type=submit]').click()
                cy.url().should('eq', indexPage)
            })
        })
    })
    describe('with invalid admin credentials', () => {
        it('should not allow access', () => {
            cy.session(['form', 'admin', 'nimda'], () => {
                cy.visit('/login.html')
                cy.get('[name=user]').type('admin')
                cy.get('[name=password]').type('nimda')
                cy.get('[type=submit]').click()
                cy.url().should('eq', loginPage)
            })
        })
    })
    describe('with valid guest credentials', () => {
        it('should still not allow guest', () => {
            cy.session(['form', 'guest', 'guest'], () => {
                cy.visit('/login.html')
                cy.get('[name=user]').type('guest')
                cy.get('[name=password]').type('guest')
                cy.get('[type=submit]').click()
                cy.url().should('eq', loginPage)
            })
        })
    })

})
