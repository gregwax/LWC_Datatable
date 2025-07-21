import { LightningElement } from 'lwc';
import getContacts from '@salesforce/apex/ContactDatatableController.getContacts';

export default class ContactDatatable extends LightningElement {

    // * Table row actions
    rowActions = [
        {
            label: 'View',
            name: 'view'
        },
        {
            label: 'Edit',
            name: 'edit'
        },
        {
            label: 'Delete',
            name: 'delete'
        }
    ];

    // * Table Columns
    contactColumns = [
        {
            label: 'Name',
            fieldName: 'ContactURL',
            type: 'url',
            typeAttributes: {
                label: {
                    fieldName: 'Name'
                },
                target: '_blank',
                tooltip: 'View Contact!'
            },
            sortable: true
        },
        {
            label: 'Account Name',
            fieldName: 'AccountURL',
            type: 'url',
            typeAttributes: {
                label: {
                    fieldName: 'AccountName'
                },
                target: '_blank',
                tooltip: 'View Account!'
            },
            sortable: true
        },
        {
            label: 'Phone',
            fieldName: 'Phone',
            type: 'phone',
            sortable: true
        },
        {
            label: 'Email',
            fieldName: 'Email',
            type: 'email',
            sortable: true
        },
        {
            label: 'Street',
            fieldName: 'street',
            sortable: true
        },
        {
            label: 'City',
            fieldName: 'city',
            sortable: true
        },
        {
            label: 'State',
            fieldName: 'state',
            sortable: true
        },
        {
            label: 'Country',
            fieldName: 'country',
            sortable: true
        },
        {
            label: 'PostalCode',
            fieldName: 'postalCode',
            sortable: true
        },
        {
            type: 'action',
            typeAttributes: {
                rowActions: this.rowActions,
                menuAlignment: 'auto'
            }
        }
    ];

    // * Table Data
    contacts = [];

    // * Sorting Attributes
    sortedBy = 'Name';
    sortedDirection = 'asc';
    defaultSortDirection = 'asc';

    // * This method will be called when the component is inserted in the DOM
    connectedCallback() {

        // * Querying contacts
        getContacts()
        .then(contacts => {
            contacts.forEach(contact => {
                contact.ContactURL = '/' + contact.Id;
                contact.AccountURL = '/' + contact.Account?.Id;
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

    // * This method will be called when a row action button is clicked
    handleRowAction(event) {
        const actionName = event.detail?.action?.name;
        const row = event.detail?.row;
        console.log('Record Details: ');
        console.log(JSON.parse(JSON.stringify(row)));
        switch (actionName) {
            case 'view':
                console.log('You clicked on View!');
                break;
            case 'edit':
                console.log('You clicked on Edit!');
                break;
            case 'delete':
                console.log('You clicked on Delete!');
                break;
            default:
                break;
        }
    }

    // * This method is used to sort records
    sortBy(field, reverse, primer) {
        const key = primer
        ? function (x) {
            return primer(x[field]);
        }
        : function (x) {
            return x[field];
        };
        return function (a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }

    // * This method will be called whenever a table header is clicked for sorting
    handleSort(event) {
        console.log(JSON.parse(JSON.stringify(event.detail)));
        const { fieldName: sortedBy, sortDirection: sortedDirection } = event.detail;
        const clonedContacts = [...this.contacts];
        clonedContacts.sort(this.sortBy(sortedBy, sortedDirection === 'asc' ? 1 : -1));
        this.contacts = clonedContacts;
        this.sortedBy = sortedBy;
        this.sortedDirection = sortedDirection;
    }
}