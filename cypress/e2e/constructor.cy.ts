import orderData from '../fixtures/order.json';
const testUrl = Cypress.config('baseUrl');
const orderNumber = orderData.order.number.toString().padStart(6, '0');
describe('Тест добавления ингидиентов в конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    if (testUrl) {
      cy.visit(testUrl);
      cy.wait('@getIngredients');
    } else {
      throw new Error('baseUrl не определён в Cypress configuration');
    }
  });

  it('Тест добавления булки в конструктор', () => {
    cy.contains('[data-cy=burger-ingredient]', 'Краторная булка N-200i')
      .contains('Добавить')
      .click();
    cy.get('[data-cy=top-bun]')
      .contains('Краторная булка N-200i')
      .should('exist');
    cy.get('[data-cy=bottom-bun]')
      .contains('Краторная булка N-200i')
      .should('exist');
  });

  it('Тест добавления начинки в конструктор', () => {
    cy.contains(
      '[data-cy=burger-ingredient]',
      'Биокотлета из марсианской Магнолии'
    )
      .contains('Добавить')
      .click();
    cy.get('[data-cy=constructor-ingredient]')
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');
  });

  it('Тест добавления соуса в конструктор', () => {
    cy.contains('[data-cy=burger-ingredient]', 'Соус Spicy-X')
      .contains('Добавить')
      .click();
    cy.get('[data-cy=constructor-ingredient]')
      .contains('Соус Spicy-X')
      .should('exist');
  });

  it('Тест добавления всех ингридиентов в конструктор', () => {
    cy.get('[data-cy=burger-ingredient]').each(($card) => {
      cy.wrap($card).contains('Добавить').click();
    });
    cy.get('[data-cy=top-bun]')
      .contains('Краторная булка N-200i')
      .should('exist');
    cy.get('[data-cy=constructor-ingredient]')
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');
    cy.get('[data-cy=constructor-ingredient]')
      .contains('Соус Spicy-X')
      .should('exist');
    cy.get('[data-cy=bottom-bun]')
      .contains('Краторная булка N-200i')
      .should('exist');
  });
});

describe('Тесты модального окна', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    if (testUrl) {
      cy.visit(testUrl);
      cy.wait('@getIngredients');
    } else {
      throw new Error('baseUrl не определён в Cypress configuration');
    }
  });
  function openIngredientModal(ingredientName: string) {
    cy.get('[data-cy=burger-ingredient]').contains(ingredientName).click();
    cy.get('[data-cy=modal]').contains(ingredientName).should('exist');
  }

  it('Тест открытия модального окна при клике на карточку ингридиента', () => {
    openIngredientModal('Краторная булка N-200i');
  });
  it('Тест закрытия модального окна при клике на кнопку закрытия', () => {
    openIngredientModal('Краторная булка N-200i');
    cy.get('[data-cy=close-modal]').click();
    cy.get('[data-cy=modal]').should('not.exist');
  });
  it('Тест закрытия модального окна при клике на оверлей', () => {
    openIngredientModal('Краторная булка N-200i');
    cy.get('[data-cy=modal-overlay]').click({ force: true });
    cy.get('[data-cy=modal]').should('not.exist');
  });
});

describe('Тест процессов оформления заказа ', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', '/api/orders', { fixture: 'order.json' });
    if (testUrl) {
      cy.visit(testUrl);
      cy.setCookie('accessToken', 'testAccessToken');
      cy.window().then((window) => {
        window.localStorage.setItem('refreshToken', 'testRefreshToken');
      });
    } else {
      throw new Error('baseUrl не определён в Cypress configuration');
    }
  });
  it('Тесты на создание заказа, проверки номера заказа, и очистки конструктора', () => {
    cy.get('[data-cy=burger-ingredient]').each(($card) => {
      cy.wrap($card).contains('Добавить').click();
    });
    cy.get('[data-cy=order-button]').click();
    cy.get('[data-cy=modal]').should('exist');
    cy.get('[data-cy=order-number]')
      .should('exist')
      .and('have.text', orderNumber);
    cy.get('[data-cy=close-modal]').click();
    cy.get('[data-cy=modal]').should('not.exist');
    cy.get('[data-cy=constructor-ingredient]').should('not.exist');
  });
  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.clearLocalStorage('refreshToken');
  });
});
