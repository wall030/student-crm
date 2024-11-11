describe('Create Student', () => {
    beforeEach(() => {
        cy.intercept('POST', 'http://localhost:8080/api/student/create', {
            statusCode: 200,
            body: { id: 1, firstName: 'Han', lastName: 'Solo', email: 'solo@smuggler.com' },
        }).as('createStudent');
    });

    it('should create a new student', () => {
        cy.visit('http://localhost:3000/students');
        cy.get('[role="add-button"]').click()

        cy.contains('Create Student').should('be.visible');

        cy.contains('label', 'First Name')
            .parent()
            .find('input')
            .type('Han');
        cy.contains('label', 'Last Name')
            .parent()
            .find('input')
            .type('Solo');
        cy.contains('label', 'E-Mail')
            .parent()
            .find('input')
            .type('solo@smuggler.com');

        cy.contains('button', 'Create').click();
        cy.contains('Create Student').should('not.exist');
        cy.wait('@createStudent');

        cy.get('table').should('contain', 'Han Solo');
    });
});
