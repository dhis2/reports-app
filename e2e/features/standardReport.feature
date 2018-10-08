Feature: Standard Report
  As a user of DHIS2
  I want to be able to preform actions on Standard Report section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    When I open Standard Report page

  Scenario:  I want to see all items in the page
    Then a pagination component is displayed
    And a search field is displayed
	And a table with list of reports is displayed
    And each item of the list contains more options icon
	And button to add report is displayed

  Scenario: I want to add a standart report
	And I click add button
	And I fill the form
	And click save
	Then a new standard report was created

  Scenario: I want see available options for report
    And I click more options icon in the reports list item
	Then a list with several options is displayed
	And there is an option to create report
	And there is an option to edit report
	And there is an option to configure share settings
	And there is an option to delete the standard report

  Scenario: I want to get a report
	And I click more options icon in the reports list item
	And I select option to create report
	And fill the get report form options
	And I click get report button
	Then report is generated

  Scenario: I want to download a report
	And I click more options icon in the reports list item
	And I select option to create report
	And fill the get report form options
	And I click download as excel button
	Then report is downloaded

  Scenario: I want to abort the generation of a report
	And I click more options icon in the reports list item
	And I select option to create report
	And fill the get report form options
	And I click cancel button
	Then the report was not generated
	And create report form is dismissed

  Scenario: I want to edit a report
	And I click more options icon on the report I want to edit
	And I select option to edit report
	And I update report name
	And click save
	Then the standart report is updated

  Scenario: I want to see configure share settings of report form
	And I click more options icon in the reports list item
	And I select option to configure share settings
	Then form with selected report name is displayed

#  Scenario: I want to configure share settings of report
#	And I click more options icon in the reports list item
#	And I select option to configure share settings
#	And I change share options
#	Then share settings of report was updated
#
#  Scenario: I want to delete a standart report
#	And I click more options icon in the reports list item
#	And I select option to delete report
#	And confirm the deletion
#	Then the standart report is removed form standard report list
