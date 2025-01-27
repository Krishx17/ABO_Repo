import { LightningElement, track } from 'lwc';
import getFilteredDoctors from '@salesforce/apex/FetchRelevantRecords.getFilteredDoctors';

export default class DoctorLocationMap extends LightningElement {
    @track mapMarkers = [];
    @track error;
    @track isLoading = false;

    // Variables to store user inputs
    firstName = '';
    lastName = '';
    city = '';
    state = '';

    // Capture input changes dynamically
    handleInputChange(event) {
        const field = event.target.dataset.field; 
        this[field] = event.target.value; 
        console.log(field);
    }

    // Handle search button click
    handleSearch() {
        this.isLoading = true;

        // Prepare dynamic parameters for the Apex method
        const searchParams = {
            firstName: this.firstName || null,
            lastName: this.lastName || null,
            city: this.city || null,
            state: this.state || null
        };

        console.log(searchParams);
        // Call the Apex method with dynamic parameters imperative calling
        getFilteredDoctors(searchParams)
            .then((data) => {
                // Map the response data to markers for the map
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
                this.error = 'Error message ' + error;
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
