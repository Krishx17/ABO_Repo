import { LightningElement, track } from 'lwc';
import getFilteredDoctors from '@salesforce/apex/DoctorSearchController.getFilteredDoctors';
// import VerifyPhysicianHeader from '@salesforce/label/c.VerifyPhysicianHeader';
// import VerifyPhysicianInstructions from '@salesforce/label/c.VerifyPhysicianInstructions';

export default class DoctorLocationMap extends LightningElement {
    @track mapMarkers = [];
    @track error;
    @track isLoading = false;
    @track noRecordsFound = false;

    // verifyPhysicianHeader = VerifyPhysicianHeader;
    // verifyPhysicianInstructions = VerifyPhysicianInstructions;

    // Variables to store user inputs
    @track firstName = '';
    @track lastName = '';
    @track gender = '';
    @track postalCode = '';
    @track city = '';
    @track state = '';
    @track radius = 5;
    @track userLat =  37.7749;
    @track userLng = -122.4194;

    // Dropdown Options
    genderOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' }
    ];

    stateOptions = [
        { label: 'Alabama', value: 'Alabama' },
        { label: 'Alaska', value: 'Alaska' },
        { label: 'Arizona', value: 'Arizona' },
        { label: 'Arkansas', value: 'Arkansas' },
        { label: 'California', value: 'California' },
        { label: 'Colorado', value: 'Colorado' },
        { label: 'Connecticut', value: 'Connecticut' },
        { label: 'Delaware', value: 'Delaware' },
        { label: 'Florida', value: 'Florida' },
        { label: 'Georgia', value: 'Georgia' },
        { label: 'Hawaii', value: 'Hawaii' },
        { label: 'Idaho', value: 'Idaho' },
        { label: 'Illinois', value: 'Illinois' },
        { label: 'Indiana', value: 'Indiana' },
        { label: 'Iowa', value: 'Iowa' },
        { label: 'Kansas', value: 'Kansas' },
        { label: 'Kentucky', value: 'Kentucky' },
        { label: 'Louisiana', value: 'Louisiana' },
        { label: 'Maine', value: 'Maine' },
        { label: 'Maryland', value: 'Maryland' },
        { label: 'Massachusetts', value: 'Massachusetts' },
        { label: 'Michigan', value: 'Michigan' },
        { label: 'Minnesota', value: 'Minnesota' },
        { label: 'Mississippi', value: 'Mississippi' },
        { label: 'Missouri', value: 'Missouri' },
        { label: 'Montana', value: 'Montana' },
        { label: 'Nebraska', value: 'Nebraska' },
        { label: 'Nevada', value: 'Nevada' },
        { label: 'New Hampshire', value: 'New Hampshire' },
        { label: 'New Jersey', value: 'New Jersey' },
        { label: 'New Mexico', value: 'New Mexico' },
        { label: 'New York', value: 'New York' },
        { label: 'North Carolina', value: 'North Carolina' },
        { label: 'North Dakota', value: 'North Dakota' },
        { label: 'Ohio', value: 'Ohio' },
        { label: 'Oklahoma', value: 'Oklahoma' },
        { label: 'Oregon', value: 'Oregon' },
        { label: 'Pennsylvania', value: 'Pennsylvania' },
        { label: 'Rhode Island', value: 'Rhode Island' },
        { label: 'South Carolina', value: 'South Carolina' },
        { label: 'South Dakota', value: 'South Dakota' },
        { label: 'Tennessee', value: 'Tennessee' },
        { label: 'Texas', value: 'Texas' },
        { label: 'Utah', value: 'Utah' },
        { label: 'Vermont', value: 'Vermont' },
        { label: 'Virginia', value: 'Virginia' },
        { label: 'Washington', value: 'Washington' },
        { label: 'West Virginia', value: 'West Virginia' },
        { label: 'Wisconsin', value: 'Wisconsin' },
        { label: 'Wyoming', value: 'Wyoming' }
    ];

    // Capture input changes dynamically
    handleInputChange(event) {
        const field = event.target.dataset.field;
        this[field] = event.target.value;
        console.log(this[field]);
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
            radius: this.radius || null,
            userLat : 37.7749,
            userLng : -122.4194
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

                    if (this.mapMarkers.length > 0) {
                        this.mapCenter = this.mapMarkers[0]; 
                    }
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
}
