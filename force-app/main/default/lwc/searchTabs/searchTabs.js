import { LightningElement } from 'lwc';

export default class SearchTabs extends LightningElement {
    isLoading = false;

    handleSearch() {
        this.isLoading = true;

        const firstName = this.template.querySelector('[data-field="firstName"]')?.value || '';
        const lastName = this.template.querySelector('[data-field="lastName"]')?.value || '';
        const city = this.template.querySelector('[data-field="city"]')?.value || '';
        const state = this.template.querySelector('[data-field="state"]')?.value || '';

        // Dispatch event with search parameters
        const searchEvent = new CustomEvent('search', {
            detail: { firstName, lastName, city, state },
        });
        this.dispatchEvent(searchEvent);

        // Simulate loading end
        setTimeout(() => {
            this.isLoading = false;
        }, 2000);
    }
}
