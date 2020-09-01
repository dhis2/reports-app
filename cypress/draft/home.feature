Feature: Home
  As a user of DHIS2
  I want to be able to See all the items and open the correspondent item

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    And I am on home

  Scenario Outline: Check the presence of the item
    Then I can see the "<item>" in the page
    And I can see a description
    And the "<text_link>" to the selected section
    Examples:
      | item                                  | text_link                              |
      | Standard Report                       | View Reports                           |
      | Data Set Report                       | Get Report                             |
      | Reporting Rate Summary                | Get Report                             |
      | Resource                              | View Resources                         |
	  | Organisation Unit Distribution Report | Get Report                             |
	  | Data Approval                         | View Data Values                       |

  Scenario Outline: Open the correspondent page
    When I click in the "<item>" in the page
    Then the side menu "<item>" is selected
    And the new section is opened with "<header>"
    Examples:
      | item                                    | header                                 |
      | Standard Report                         | Standard Report                        |
      | Data Set Report                         | Data Set Report                        |
      | Reporting Rate Summary                  | Reporting Rate Summary                 |
      | Resource                                | Resource                               |
	  | Organisation Unit Distribution Report   | Organisation Unit Distribution Report  |
	  | Data Approval                           | Data Approval                          |