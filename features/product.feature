Feature: Product
  In order to keep Product api stable
  As a tester
  I want to make sure that everything works as expected

  Scenario: List Products
    Given I make a GET request to /api/products
      And I set query param type to DRINK
     When I receive a response
     Then I expect response should have a status 200
      And I expect response should have a json schema
      """
      {
        "type": "array",
        "items": {
          "type": "object",
          "required": [
            "name",
            "description",
            "price",
            "type"
          ],
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            },
            "createdAt": {
              "type": "string"
            },
            "updatedAt": {
              "type": "string"
            },
            "deletedAt": {
              "type": "null"
            },
            "name": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "price": {
              "type": "number"
            },
            "type": {
              "type": "string"
            }
          }
        }
      }
      """