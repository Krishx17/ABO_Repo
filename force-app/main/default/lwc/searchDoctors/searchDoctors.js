import { LightningElement, track } from 'lwc';
import getNearbyDoctors from '@salesforce/apex/DoctorSearchController.getNearbyDoctors';

export default class SearchDoctors extends LightningElement {
    @track radius = 10; // Default Radius (km)
    @track mapMarkers = [];
    @track mapCenter = { location: { Latitude: 37.7749, Longitude: -122.4194 } }; // Default Center (San Francisco)

    handleRadiusChange(event) {
        this.radius = event.target.value;
    }

    filterMarkers() {
        getNearbyDoctors({ radius: this.radius, userLat: 37.7749, userLong: -122.4194 }) 
            .then((data) => {
                this.mapMarkers = data.map(doctor => ({
                    location: {
                        City: doctor.City__c,
                        Country: doctor.Country__c,
                        PostalCode: doctor.PostalCode__c,
                        State: doctor.State__c,
                        Street: doctor.Street__c
                    },
                    title: doctor.Name,
                    description: `City: ${doctor.City__c}, Phone: ${doctor.Phone__c}`
                }));

                // Set the center of the map dynamically
                if (this.mapMarkers.length > 0) {
                    this.mapCenter = this.mapMarkers[0]; 
                }
            })
            .catch((error) => {
                console.error('Error fetching doctors:', error);
            });
    }
}
