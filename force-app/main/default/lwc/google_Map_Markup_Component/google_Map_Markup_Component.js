import { LightningElement, wire } from 'lwc';
import getFilteredDoctors from '@salesforce/apex/FetchRelevantRecords.getFilteredDoctors';
export default class DoctorLocationMap extends LightningElement {
    mapMarkers = [];
    error;

    // Parameters for location filtering (update dynamically if needed)
    city = 'Los Angeles';
    state = 'CA';

    @wire(getFilteredDoctors, { city: '$city'})
    wiredDoctors({ error, data }) {
        console.log(data);
        if (data) {
            this.mapMarkers = data.map(doctor => ({
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
        } else if (error) {
            console.log("in else if");
            this.error = error;
            this.mapMarkers = [];
        }
    }
}

//client se jo variables ki value hai location ki and name ki vo 

//html figure out krni h

//search feature enhancement    