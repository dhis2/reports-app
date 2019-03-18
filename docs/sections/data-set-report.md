# Data Set Report

## Behavior

In this section the user can generate a report based on a chosen
data set for a location during a time frame.

### Data set dimensions

When the user selects a data set, the app sends a request to check whether
there are any dimensions connected to the chosen data set.
If there are, the form will render additional dropdowns so the user
can optionally choose dimensions as filters for the report.<br>
_Loading the dimensions doens't block the UI._

##### Planned implementation changes

In the future there'll be a section for the data set dimensions
which can have three states:

**1. No data set selected**<br>
While no data set has been selected, the user will be notified that
he will have to pick a data set first in order to see dimensions

**2. No dimensions connected**<br>
If there are no dimensions connected to the data set, the user will
be notified that there are no connections and that no error happened

**3. Dimension dropdowns**<br>
If there are dimensions, a select field will be rendered for each
dimension.
