Feature: filter JSON

  Background:
    Given a file named "my.json" with:
      """
        {
          "foo": {
            "bar": {
              "zip": "val1",
              "zap": "val2",
              "arr": [1, 2, 3, 4, 5, 6]
            }
          },
          "quux": {
            "zip": "val"
          }
        }
      """

    Scenario: filter by key regex
      When I run `jsong my.json -k 'z\wp'`
      Then the output should contain exactly:
      """
      foo.bar.zip: val1
      foo.bar.zap: val2
      quux.zip: val

      """

    Scenario: filter by key regex shows nested objects
      When I run `jsong my.json -k foo`
      Then the output should contain:
      """
      foo.bar.zip: val1
      foo.bar.zap: val2
      """

    Scenario: filter by value regex
      When I run `jsong my.json -v 'val\d'`
      Then the output should contain exactly:
      """
      foo.bar.zip: val1
      foo.bar.zap: val2

      """
      
    Scenario: filter by regex matching either key or value
      When I run `jsong my.json -a '[\w]{4}'`
      Then the output should contain exactly:
      """
      foo.bar.zip: val1
      foo.bar.zap: val2
      quux.zip: val

      """

    Scenario: display array indices
      When I run `jsong my.json -v 5`
      Then the output should contain exactly:
      """
      foo.bar.arr[4]: 5

      """

