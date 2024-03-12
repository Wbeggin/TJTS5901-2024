Feature: Verify input quantity

  Scenario: Verify input quantity is valid
    Given Fetch the current market last trade price for "AAPL"

    When Attempt to place a "Bid" order at Price M2 by a quantity of 0
    Then The order is rejected
    
    When Attempt to place a "Bid" order at Price M2 by a quantity of 10.1
    Then The order is rejected

    When Attempt to place a "Offer" order at Price M2 by a quantity of -100
    Then The order is rejected

    #Verify no trades have happened for the rejected orders