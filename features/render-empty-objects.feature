Feature: render empties

  Background:
    Given a file named "my.json" with:
    """
      {
        "obj": {},
        "nested-array": [[[]], {}]
      }
    """

  Scenario: render empty objects
    When I run `jsong my.json -k obj`
    Then the output should contain exactly:
    """
    obj: {}

    """

  Scenario: render empty arrays
    When I run `jsong my.json -k nested-array`
    Then the output should contain exactly:
    """
    nested-array[0][0]: []
    nested-array[1]: {}

    """

  Scenario: render totally empty doc
    Given a file named "blank.json" with:
    """
      {}
    """
    When I run `jsong blank.json`
    Then the output should contain exactly:
    """
    <empty>

    """
