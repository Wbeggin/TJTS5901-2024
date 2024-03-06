Feature: Verify input prices based on latest market data

  Scenario: Verify input prices are validated against the latest market data for AAPL
    Given Fetch the current market last trade price for "AAPL"
    When Attempt to place a Bid order at Price M1 multiplied by 1.08
    Then The order is accepted
    
    When Attempt to place an Offer order at Price M1 multiplied by 0.90
    Then The order is accepted

    When Attempt to place a Bid order at Price M1 multiplied by 1.11
    Then The order is rejected

    When Attempt to place an Offer order at Price M1 multiplied by 0.90
    Then The order is accepted

    When Attempt to place an Offer order at Price M1 multiplied by -1.01
    Then The order is rejected

    #And I verify no trades have happened since the last price fetch
