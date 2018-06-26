Feature: Help
  As a user of DHIS2
  I want to be able to See the Help for section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    And I am on home

  Scenario Outline: Open the correspondent documentation page
    When I click in the "<section>" in the page
    And I click help icon
    Then A documentation page in a new tab is opened
    Examples:
      | section                                 |
      | Standard Report                         |
      | Data Set Report                         |
      | Reporting Rate Summary                  |
      | Resource                                |
	  | Organisation Unit Distribution Report   |
	  | Data Approval                           |