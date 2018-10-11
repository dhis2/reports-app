Feature: Resource
  As a user of DHIS2
  I want to be able to preform actions on Resource Report section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    When I open Resource page

  Scenario:  I want to see all items in the page
    Then a pagination component is displayed
    And a search field is displayed
	And a table with list of resources is displayed
    And each item of the list contains more options icon
	And button to add resource is displayed

  Scenario: I want to add new resource from URL
	And I click add resource button
	And I insert name for url resourse
	And I select External URL
	And insert URL
	And click save resource
	Then a new resource was created

  Scenario: I want to add new resource from file
	And I click add resource button
	And I insert name for file resource
	And I select Upload File
	And choose file from computer
	And click save
	Then a new resource was created
#
#  Scenario: I want to cancel the add of new resource
#	And I click add button
#	And fill the form
#	And click cancel
#	Then the new resource was not created
#
#  Scenario: I want see available options for resource
#    And I click more options icon in the resource list item
#	Then a list with several options is displayed
#	And there is an option to view resource
#	And there is an option to edit resource
#	And there is an option to configure share settings
#	And there is an option to delete the resource
#
#  Scenario: I want to see a resource from file
#	And I click more options icon in the resource list item configured with file
#	And I select option to view resource
#	Then resource is displayed
#
#  Scenario: I want to see a resource from html
#	And I click more options icon in the resource list item configured with html
#	And I select option to view resource
#	Then resource is displayed
#
#  Scenario: I want to edit a resource
#	And I click more options icon in the resource list item
#	And I select option to edit resource
#	And update the form resource
#	And I save the changes
#	Then the resource is updated
#
#  Scenario: I want to see configure share settings of resource form
#	And I click more options icon in the resource list item
#	And I select option to configure share settings
#	Then form with selected resource name is displayed
#
#
#  Scenario: I want to configure share settings of resource
#	And I click more options icon in the resource list item
#	And I select option to configure share settings
#	And I change share options
#	Then share settings of resource was updated
#
  Scenario: I want to delete a resource
	And I click more options icon on the resource I want to delete
	And I select option to delete resource
	And confirm the deletion
	Then the resource is removed form resources list
