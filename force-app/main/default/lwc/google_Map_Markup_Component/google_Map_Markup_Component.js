import { LightningElement, track } from 'lwc';
import getFilteredDoctors from '@salesforce/apex/FetchRelevantRecords.getFilteredDoctors';

export default class DoctorLocationMap extends LightningElement {
    @track mapMarkers = [];
    @track error;
    @track isLoading = false;

    city = '';
    state = '';

    // Capture input changes dynamically
    handleInputChange(event) {
        const field = event.target.dataset.field; // Get the field from dataset
        this[field] = event.target.value; // Update the corresponding property
    }

    // Handle search button click
    handleSearch() {
        this.isLoading = true;

        // Call the Apex method with dynamic parameters
        getFilteredDoctors({
            city: this.city,
            state: this.state
        })
            .then((data) => {
                this.mapMarkers = data.map((doctor) => ({
                    location: {
                        City: doctor.City__c,
                        Country: doctor.Country__c,
                        PostalCode: doctor.PostalCode__c,
                        State: doctor.State__c,
                        Street: doctor.Street__c
                    },
                    value: doctor.Id,
                    title: doctor.Name,
                    description: doctor.Description__c || 'No specialty provided',
                    icon: 'standard:user'
                }));
                this.error = undefined;
            })
            .catch((error) => {
                this.error = error;
                this.mapMarkers = [];
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    get buttonLabel() {
        return this.isLoading ? 'Searching...' : 'Search';
    }
}
