import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import fetchAccordionData from '@salesforce/apex/AccordionMetadataService.fetchAccordionData';

export default class DynamicAccordion extends NavigationMixin(LightningElement) {
    accordionData;
    pageReference;
    activeSections = [] ;
    sectionUrl;

    @wire(fetchAccordionData)
    wiredData({ data, error }) {
        if (data) {
            this.accordionData = data;
            console.log('this.accordionData::'+JSON.stringify(this.accordionData));
        } else if (error) {
            console.error('Error fetching accordion data:', error);
        }
    }

    connectedCallback() {
        this.activeSections = [];

    }

    handleToggleSection(event) {
        console.log('handleToggleSection');
        console.log('event.target::'+JSON.stringify(event.target));
        console.log('event.target.name::'+event.target.name);
        console.log('event.detail::'+JSON.stringify(event.detail));
        console.log('event.detail.openSections::'+event.detail.openSections +' ' +window.location.origin);
        
        this.navigatPage(event.target.name);
    }

    handleUrlClick(event) {
        console.log('navigatPage');
        this.navigatPage(event.target.name);    
    } 

    navigatPage(pageName){

        this.pageReference = {
            type: 'comm__namedPage',
            attributes: {
                name: pageName //api name of community page
            }
        };

        if (this.pageReference) {
            this[NavigationMixin.GenerateUrl](this.pageReference)
                .then(url => {
                    this.href = url;
                });
        }
        //  evt.stopPropagation();
        //  evt.preventDefault();

        if (this.pageReference) {
            this[NavigationMixin.Navigate](this.pageReference);
        } 
    }
}