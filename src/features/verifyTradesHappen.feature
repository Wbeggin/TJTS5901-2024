Feature: Verify trades happening

  Scenario: Verify trades are happening according to the given logic
    Given Fetch the current market last trade price for "AAPL"
    
    When Order "Bid" price x 1, qty: 100
    When Order "Offer" price x 0.8, qty: 200
    When Order "Bid" price x 1.01, qty: 200
    When Order "Bid" price x 0.95, qty: 50
    When Order "Bid" price x 1, qty: 30
    When Order "Offer" price x 1, qty: 250

    Then Trades were made