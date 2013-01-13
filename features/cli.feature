Feature: cli features

  Scenario: get help
    When I run `jsong -h`
    Then jsong fails with a help message
