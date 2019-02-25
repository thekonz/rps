// https://docs.cypress.io/api/introduction/api.html

describe("game", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("initializes the game area", () => {
    cy.contains("h1", "Rock, paper, scissors");

    // score area
    cy.contains(".score [ref=wins]", "0");
    cy.contains(".score [ref=ties]", "0");
    cy.contains(".score [ref=losses]", "0");

    cy.get(".actions")
      .find(".actions__button")
      .should("have.length", 4);
    cy.get(".actions")
      .find(".actions__button .hand")
      .eq(0)
      .should("have.class", "hand--computer");
  });

  it("lets you play rock paper scissors", () => {
    cy.get(".actions button")
      .eq(0)
      .click();
    cy.wait(1000);
    cy.contains(".score", "1");
  });

  it("prevents spamming buttons", () => {
    cy.get(".actions button")
      .eq(0)
      .click()
      .click()
      .click();
    cy.wait(1000);
    cy.contains(".score", "1");
  });
});
