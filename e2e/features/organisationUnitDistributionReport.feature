Feature: Organisation Unit Distribution Report
  As a user of DHIS2
  I want to be able to preform actions on Organisation Unit Distribution Report section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    When I open Organisation Unit Distribution Report page

  Scenario:  I want to see all items in the page
    Then a column with parent organisation unit selection is displayed
    And a group set without option selected
	And a get report button disabled
    And a get chart button disabled

  Scenario:  I want to get report
    And I select parent organisation unit
	And I select group set
	And click get report
	Then a new page is displayed
	And button to return to previous page is displayed
	And a table with several columns with results is displayed
	And Option to download as XLS is displayed

  Scenario:  I want to get chart
    And I select parent organisation unit
	And I select group set
	And click get chart
	Then a new page is displayed
	And button to return to previous page is displayed
	And a chart with results is displayed

  Scenario:  I want to return from results
    And I select parent organisation unit
	And I select group set
	And click get report
	And click  button to return to previous page
	Then Organisation Unit Distribution Report page is displayed

  Scenario Outline: I want to se results for group set
	And I select parent organisation unit
	And I select group set value "<group_set>"
	And click get report
	Then a new page is displayed

	Examples:
	|group_set|
	|Area|
	|Facility Ownership|
	|Facility Type|
	|Location Rural/Urban|