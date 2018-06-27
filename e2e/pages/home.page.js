const Page = require('./page');

class Home extends Page {
    open() {
        super.open();
    }

    isSectionOptionVisible(section) {
        browser.waitForVisible(`.section-title=${section}`, 5000);
    }

    isSectionDescriptionVisible(section) {
        return !!this.getCardForSection(section);
    }

    getTextLinkFromSection(section) {
        const cardSection = this.getCardForSection(section);
        if (cardSection) {
            return cardSection.element('.section-action-text').getText();
        }
        return null;
    }

    getCardForSection(section) {
        browser.waitForVisible('.section', 5000);
        const sections = browser.elements('.section').value;
        for (let currentSection of sections) {
            if (currentSection.element('.section-title').getText() === section) {
                return currentSection;
            }
        }
        return null;
    }

    getMenuItemForSection(section) {
        browser.waitForVisible('.left-bar', 5000);
        const sections = browser.elements('.left-bar a').value;
        for (let currentSection of sections) {
            if (currentSection.element('div > div > div').getText().includes(section)) {
                return currentSection;
            }
        }
        return null;
    }

    isSectionActiveAtMenu(section) {
        const sectionElement = this.getMenuItemForSection(section);
        return !!sectionElement.getCssProperty('background-color');
    }
}

module.exports = new Home();
