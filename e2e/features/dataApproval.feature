Feature: Data Approval
  As a user of DHIS2
  I want to be able to preform actions on Data Approval section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    When I open Data Approval page

  Scenario:  I want to see all items in the page
    Then organisation unit selection for data approval is displayed
    And data set selection for data approval is displayed
	And get data button disabled

  Scenario: I want to get data
	And I select organisation unit for data approval
	And I select data set for data approval
	And I select period to retrieve data
	And click get data button
	Then new page with data approval is displayed
	And return to previous page is displayed
	And sub-title with selected filters is displayed
	And approval status is displayed
	And table with results is displayed
