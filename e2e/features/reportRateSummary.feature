Feature: Report Rate Summary
  As a user of DHIS2
  I want to be able to preform actions on Report Rate section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    When I open Report Rate Summary page

  Scenario: I want to see all items in the page
    Then a report organisation unit selection is displayed
    And a criteria selection is displayed
    And a data set selection is displayed
    And a report period selection is displayed
    And a show more options selector
    And get report button is disabled

  Scenario: I want to see more options
    And open more options
    Then extra options are displayed
    And show fewer options selector is displayed

  Scenario: I want to see button generate disabled when no period is selected
    And fill the form with valid data except the period
    Then get report button is disabled

  Scenario: I want to see button generate disabled when no organisation unit is selected
    And fill the form with valid data without selecting organisation unit
    Then get report button is disabled

  Scenario: I do not want to see more options
    And open more options
    And click show fewer options
    Then extra options are not displayed

  Scenario: I want to see a report
    And I fill the form with valid data
    And click to generate the report
    Then a title for reports is displayed
    And a table with report is displayed
    And download option is available
    And return button is displayed

  Scenario: I want to export a report
    And I fill the form with valid data
    And click to generate the report
    And I click to download as xls
    Then a download is started