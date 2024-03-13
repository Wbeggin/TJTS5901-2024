Feature: Verify input quantity

  Scenario: Verify input quantity is valid
    Given Fetch the current market last trade price for "AAPL"

    When Order "Bid" price x 1, qty: 0
    Then The order is rejected
    Then No trade was made
    
    When Order "Bid" price x 1, qty: 10.1
    Then The order is rejected
    Then No trade was made

    When Order "Bid" price x 1, qty: -100
    Then The order is rejected
    Then No trade was made