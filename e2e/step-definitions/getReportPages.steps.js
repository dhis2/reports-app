const {expect} = require('chai');
const {defineSupportCode} = require('cucumber');

const dataSetReport = require('../pages/dataSetReport.page');
const reportingRateSummary = require('../pages/reportingRateSummary.page');

const DEFAULT_WAIT_TIME = 5000;

const VALID_DATA_SET = 'ART monthly summary';
const DIFFERENT_VALID_DATA_SET_WITH_OPTIONS = 'Emergency Response';
const VALID_PERIOD_TYPE = 'Yearly';
const VALID_PERIOD = '2018';
const DEFAULT_CRITERIA_REPORTING_RATE_SUMMARY = 'Complete data set registrations';

const fsExtra = require('fs-extra');
const fs = require('fs');
const pathToChromeDownloads = './chromeDownloads';
const pathToReportFile = `${pathToChromeDownloads}/report.xlsx`;

const assertCurrentDataSet = (dataSet) => {
    expect(browser.element('#data-set-selection > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)').getText()).to.equal(dataSet);
};

const selectDataSetWithName = (name) => {
    browser.element('#data-set-selection').waitForVisible(DEFAULT_WAIT_TIME);
    browser.element('#data-set-selection button').click();
    const menuItems = browser.elements('span[role=menuitem]').value;
    for (let menuItem of menuItems) {
        if (menuItem.element('div > div > div').getText() === name) {
            menuItem.click();
            break;
        }
    }
};

const selectValidDataSet = () => {
    selectDataSetWithName(VALID_DATA_SET);
    browser.pause(DEFAULT_WAIT_TIME);
    assertCurrentDataSet(VALID_DATA_SET);
};

const selectDifferentDataSet = () => {
    selectDataSetWithName(DIFFERENT_VALID_DATA_SET_WITH_OPTIONS);
    browser.pause(DEFAULT_WAIT_TIME);
    assertCurrentDataSet(DIFFERENT_VALID_DATA_SET_WITH_OPTIONS);
};

const getOneOrgUnitTreeFromTreeByIndex = (index) => {
    return browser.elements('.tree-view div[role=button]').value[index].element('<input>');
};

const isOrganisationUnitSelected = () => {
    const checkboxes = browser.element('.tree-view').elements('.tree-view input[type=checkbox]').value;
    for (let currentCheckbox of checkboxes) {
        if (currentCheckbox.isSelected()) {
            return true;
        }
    }
    return false;
};

const assertCurrentPeriodType = (periodType) => {
    expect(browser.element('#report-period > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)').getText()).to.equal(periodType);
};

const selectPeriodTypeWithName = (name) => {
    browser.element('#report-period').waitForVisible(DEFAULT_WAIT_TIME);
    browser.element('#report-period button').click();
    const menuItems = browser.elements('span[role=menuitem]').value;
    for (let menuItem of menuItems) {
        if (menuItem.element('div > div > div').getText() === name) {
            menuItem.click();
            break;
        }
    }
};

const selectValidPeriodType = () => {
    selectPeriodTypeWithName(VALID_PERIOD_TYPE);
    browser.pause(DEFAULT_WAIT_TIME);
    assertCurrentPeriodType(VALID_PERIOD_TYPE);
};

const selectValidPeriod = (periodType, period) => {
    selectValidPeriodType();
    browser.element('#report-period > div > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(1) > button').click();
    const menuItems = browser.elements('span[role=menuitem]').value;
    for (let menuItem of menuItems) {
        if (menuItem.element('div > div > div').getText() === period) {
            menuItem.click();
            break;
        }
    }
    browser.pause(DEFAULT_WAIT_TIME);
    expect(browser.element('#report-period > div > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)').getText()).to.equal(period);

}

defineSupportCode(({Given, When, Then}) => {
    When(/^I open Data Set Report page$/, () => {
        dataSetReport.open();
    });

    When(/^I open Reporting Rate Summary page$/, () => {
        reportingRateSummary.open();
    });

    // *********************************************************
    // Scenario: I want to see all items in the page
    // *********************************************************
    Then(/^a report organisation unit selection is displayed$/, () => {
        browser.element('.tree-view').waitForVisible(DEFAULT_WAIT_TIME);
    });

    Then(/^a criteria selection is displayed$/, () => {
        browser.element('#criteria-selection').waitForVisible(DEFAULT_WAIT_TIME);
        expect(browser.element('#criteria-selection > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)').getText()).to.equal(DEFAULT_CRITERIA_REPORTING_RATE_SUMMARY);
    });

    Then(/^a data set selection is displayed$/, () => {
        browser.element('#data-set-selection').waitForVisible(DEFAULT_WAIT_TIME);
        assertCurrentDataSet('');                                   // no selection
    });

    Then(/^a report period selection is displayed$/, () => {
        browser.element('#report-period').waitForVisible(DEFAULT_WAIT_TIME);
        assertCurrentPeriodType('');                                // no selection
    });

    Then(/^checkbox for selected unit only$/, () => {
        browser.element('input[id=selected-unit-only][type=checkbox]').waitForExist(DEFAULT_WAIT_TIME);
        // div of checkbox presentation
        browser.element('input[id=selected-unit-only][type=checkbox] + div').waitForVisible(DEFAULT_WAIT_TIME);
    });

    Then(/^a show more options selector$/, () => {
        browser.element('#extra-options-action').waitForVisible(DEFAULT_WAIT_TIME);
    });

    Then(/^get report button is disabled$/, () => {
        browser.element('#main-action-button button').waitForVisible(DEFAULT_WAIT_TIME);
        expect(browser.element('#main-action-button button').isEnabled()).to.equal(false);
    });

    // *********************************************************
    // Scenario: I want to see more options
    // *********************************************************
    When(/^open more options$/, () => {
        browser.element('#extra-options-action').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('#extra-options-action').click();
    });

    Then(/^extra options are displayed$/, () => {
        browser.element('#extra-options').waitForVisible(DEFAULT_WAIT_TIME);
        expect(browser.element('#extra-options').getCssProperty('display').value).to.equal('block');
    });

    Then(/^show fewer options selector is displayed$/, () => {
        expect(browser.element('#extra-options-action').getText()).to.equal('Show few options');
    });

    // *********************************************************
    // Scenario: I want to see button generate disabled when no period is selected
    // *********************************************************
    When(/^fill the form with valid data except the period$/, () => {
        selectValidDataSet();
        getOneOrgUnitTreeFromTreeByIndex(0).click();
        expect(isOrganisationUnitSelected()).to.equal(true);
    });

    // *********************************************************
    // Scenario: I want to see button generate disabled when no period is selected
    // *********************************************************
    When(/^fill the form with valid data without selecting organisation unit$/, () => {
        selectValidDataSet();
        selectValidPeriod(VALID_PERIOD_TYPE, VALID_PERIOD);
    });

    // *********************************************************
    // Scenario: I want to see options based on data set
    // *********************************************************
    When(/^select data set$/, () => {
        selectValidDataSet();
    });

    Then(/^available options are updated for selected data set$/, () => {
        browser.element('#data-set-dimensions-container').waitForVisible(DEFAULT_WAIT_TIME);
        expect(browser.elements('.data-set-dimension').value.length > 0).to.equal(true);
    });

    Then(/^no option is selected for selectable options$/, () => {
        const dimensions = browser.elements('.data-set-dimension').value;
        for (let i = 1; i <= dimensions.length; i++) {
            expect(browser.element(`.data-set-dimension:nth-child(${i}) > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)`).getText()).to.equal('');
        }
    });

    // *********************************************************
    // Scenario: I want to see options based on data set
    // *********************************************************
    When(/^select different data set with options$/, () => {
        selectDifferentDataSet();
    });

    // *********************************************************
    // Scenario: I want to see options based on data set
    // *********************************************************
    When(/^click show fewer options$/, () => {
        browser.element('#extra-options-action').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('#extra-options-action').click();
    });

    Then(/^extra options are not displayed$/, () => {
        expect(browser.element('#extra-options').getCssProperty('display').value).to.equal('none');
    });

    // *********************************************************
    // Scenario: I want to see a report
    // *********************************************************
    When(/^I fill the form with valid data$/, () => {
        selectValidDataSet();
        getOneOrgUnitTreeFromTreeByIndex(0).click();
        expect(isOrganisationUnitSelected()).to.equal(true);
        selectValidPeriod(VALID_PERIOD_TYPE, VALID_PERIOD);
        expect(browser.element('#main-action-button button').isEnabled()).to.equal(true);
    });

    When(/^click to generate the report$/, () => {
        browser.element('#main-action-button button').click();
    });

    Then(/^one or more tables with report are displayed$/, () => {
        browser.element('#report-container table').waitForVisible(DEFAULT_WAIT_TIME);
    });

    Then(/^download option is available$/, () => {
        browser.element('#download-options-container').waitForVisible(DEFAULT_WAIT_TIME);
    });

    Then(/^return button is displayed$/, () => {
        browser.element('#back-button').waitForVisible(DEFAULT_WAIT_TIME);
    });

    Then(/^share comment for results option is displayed$/, () => {
        browser.element('#share-component').waitForVisible(DEFAULT_WAIT_TIME);
    });

    // *********************************************************
    // Scenario: I want to export a report
    // *********************************************************
    Then(/^I click to download as xls$/, () => {
        // Clean up the chromeDownloads folder and create a fresh one
        fsExtra.removeSync(pathToChromeDownloads);
        fsExtra.mkdirsSync(pathToChromeDownloads);
        expect(fs.existsSync(pathToReportFile)).to.equal(false);

        browser.element('#download-options-container').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('#download-options-container span').click();
    });

    Then(/^a download is started$/, () => {
        browser.pause(DEFAULT_WAIT_TIME);
        expect(fs.existsSync(pathToReportFile)).to.equal(true);
    });

    // *********************************************************
    // Scenario: I want to share a report comment
    // *********************************************************
    When(/^I write some comment in the share field$/, () => {
        browser.element('#share-component').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('#share-component textarea:nth-child(2)').setValue('Comment');
    });

    When(/^I click in the share link$/, () => {
        browser.element('#share-component').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('#share-component button').click();
        browser.pause(DEFAULT_WAIT_TIME);                       // give time for previous snackbar disappear
    });

    Then(/^comment is submitted$/, () => {
        const snackbarMessage = browser.element('#feedback-snackbar > div > div > div > span > div > div');
        snackbarMessage.waitForVisible(DEFAULT_WAIT_TIME);
        expect(snackbarMessage.getText()).to.equal('Interpretation Shared');
    });
});
