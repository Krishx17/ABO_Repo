import { LightningElement, track } from 'lwc';
import getFilteredDoctors from '@salesforce/apex/FetchRelevantRecords.getFilteredDoctors';
import VerifyPhysicianHeader from '@salesforce/label/c.VerifyPhysicianHeader';
import { NavigationMixin } from 'lightning/navigation';
import VerifyPhysicianInstructions from '@salesforce/label/c.VerifyPhysicianInstructions';

export default class DoctorLocationMap extends LightningElement {
    @track mapMarkers = [];
    @track error;
    @track isLoading = false;
    @track noRecordsFound = false;

    verifyPhysicianHeader = VerifyPhysicianHeader;
    verifyPhysicianInstructions = VerifyPhysicianInstructions;

    // Variables to store user inputs
    firstName = '';
    lastName = '';
    gender = '';
    postalCode = '';
    city = '';
    state = '';
    distance = 5;

    // Dropdown Options
    genderOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' }
    ];

    // Capture input changes dynamically
    handleInputChange(event) {
        const field = event.target.dataset.field;
        this[field] = event.target.value;
    }

    validateInputs() {
        return this.firstName || this.lastName || this.gender || this.postalCode || this.city || this.state;
    }

    handleSearch() {
        if (!this.validateInputs()) {
            this.error = 'Please enter at least one search criteria.';
            this.mapMarkers = [];
            this.noRecordsFound = true;
            return;
        }

        this.isLoading = true;
        this.error = null;
        this.noRecordsFound = false;

        const searchParams = {
            firstName: this.firstName || null,
            lastName: this.lastName || null,
            gender: this.gender || null,
            postalCode: this.postalCode || null,
            city: this.city || null,
            state: this.state || null,
            distance: this.distance || 5
        };

        getFilteredDoctors(searchParams)
            .then((data) => {
                if (data.length > 0) {
                    this.mapMarkers = data.map((doctor) => ({
                        location: {
                            City: doctor.City__c,
                            Country: doctor.Country__c,
                            PostalCode: doctor.PostalCode__c,
                            State: doctor.State__c,
                            Street: doctor.Street__c,
                            Gender:doctor.Gender__c

                        },
                        value: doctor.Id,
                        title: doctor.Name,
                        description: doctor.Description__c || 'No specialty provided',
                        icon: 'standard:user'
                    }));
                    this.noRecordsFound = false;
                } else {
                    this.mapMarkers = [];
                    this.noRecordsFound = true;
                }
                this.error = undefined;
            })
            .catch((error) => {
                this.error = 'Error message: ' + error;
                this.mapMarkers = [];
                this.noRecordsFound = true;
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    get buttonLabel() {
        return this.isLoading ? 'Searching...' : 'Search';
    }
    /*handleDoctorClick(event) {
        const doctorId = event.target.dataset.id;

        // Navigate to the doctor's record page
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: doctorId,
                objectApiName: 'Doctor__c', // Replace with the API name of your object
                actionName: 'view'
            }
        });
    }*/
}
