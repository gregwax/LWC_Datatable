import { LightningElement } from 'lwc';
import getContacts from '@salesforce/apex/ContactDatatableController.getContacts';

export default class ContactDatatable extends LightningElement {

    // * Table Columns
    contactColumns = [
        {
            label: 'Name',
            fieldName: 'Name'
        },
        {
            label: 'Account Name',
            fieldName: 'AccountName'
        },
        {
            label: 'Phone',
            fieldName: 'Phone'
        },
        {
            label: 'Email',
            fieldName: 'Email'
        },
        {
            label: 'Street',
            fieldName: 'street'
        },
        {
            label: 'City',
            fieldName: 'city'
        },
        {
            label: 'State',
            fieldName: 'state'
        },
        {
            label: 'Country',
            fieldName: 'country'
        },
        {
            label: 'PostalCode',
            fieldName: 'postalCode'
        }
    ];

    // * Table Data
    contacts = [];

    // * This method will be called when the component is inserted in the DOM
    connectedCallback() {

        // * Querying contacts
        getContacts()
        .then(contacts => {
            contacts.forEach(contact => {
                contact.AccountName = contact.Account?.Name;
                contact.street = contact.MailingAddress?.street;
                contact.city = contact.MailingAddress?.city;
                contact.state = contact.MailingAddress?.state;
                contact.country = contact.MailingAddress?.country;
                contact.postalCode = contact.MailingAddress?.postalCode;
            });
            console.log(contacts);
            this.contacts = contacts;
        })
        .catch(error => console.log(error));
    }
}