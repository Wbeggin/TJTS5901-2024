Feature: Verify input prices based on latest market data

  Scenario: Verify input prices are validated against the latest market data for AAPL
    Given Fetch the current market last trade price for "AAPL"

    When Order "Bid" price x 1.08, qty: 1
    Then The order is accepted

    When Order "Offer" price x 0.9, qty: 1
    Then The order is accepted

    When Order "Bid" price x 1.11, qty: 1
    Then The order is rejected
    Then No trade was made

    When Order "Offer" price x -1.01, qty: 1
    Then The order is rejected
    Then No trade was made