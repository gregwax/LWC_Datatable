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
            sortable: true,
            wrapText: true,
            hideDefaultActions: true
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
            sortable: true,
            wrapText: true,
            hideDefaultActions: true
        },
        {
            label: 'Phone',
            fieldName: 'Phone',
            type: 'phone',
            sortable: true,
            wrapText: true,
            hideDefaultActions: true
        },
        {
            label: 'Email',
            fieldName: 'Email',
            type: 'email',
            sortable: true,
            wrapText: true,
            hideDefaultActions: true
        },
        {
            label: 'Lead Source',
            fieldName: 'LeadSource',
            sortable: true,
            wrapText: true,
            hideDefaultActions: true,
            actions: [
                { label: 'All', checked: true, name: 'all' },
                { label: 'Web', checked: false, name: 'web' },
                { label: 'Phone Inquiry', checked: false, name: 'phone_inquiry' },
                { label: 'Partner Referral', checked: false, name: 'partner_referral' },
                { label: 'Purchased List', checked: false, name: 'purchased_list' },
                { label: 'Other', checked: false, name: 'other' },
                { label: 'External Referral', checked: false, name: 'external_referral'},
                { label: 'Partner', checked: false, name: 'partner' },
                { label: 'Public Relations', checked: false, name: 'public_relations' },
                { label: 'Trade Show', checked: false, name: 'trade_show' },
                { label: 'Word of mouth', checked: false, name: 'word_of_mouth' }
            ]
        },
        {
            label: 'Street',
            fieldName: 'street',
            sortable: true,
            wrapText: true,
            hideDefaultActions: true
        },
        {
            label: 'City',
            fieldName: 'city',
            sortable: true,
            wrapText: true,
            hideDefaultActions: true
        },
        {
            label: 'State',
            fieldName: 'state',
            sortable: true,
            wrapText: true,
            hideDefaultActions: true
        },
        {
            label: 'Country',
            fieldName: 'country',
            sortable: true,
            wrapText: true,
            hideDefaultActions: true
        },
        {
            label: 'PostalCode',
            fieldName: 'postalCode',
            sortable: true,
            wrapText: true,
            hideDefaultActions: true
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
    originalContacts = [];

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
            this.originalContacts = contacts;
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
            return primer(field, x);
        }
        : function (x) {
            return x[field];
        };
        return function (a, b) {
            a = key(a);
            b = key(b);
            // * Handling undefined values
            if(a === b) {
                return 0;
            } else if(a === undefined) {
                return reverse * -1;
            } else if(b === undefined) {
                return reverse * 1;
            }
            return reverse * ((a > b) - (b > a));
        };
    }

    // * Helper method for sortBy method
    primer(field, record) {
        let returnValue;
        switch (field) {
            case 'ContactURL':
                returnValue = record['Name'];
                break;
            case 'AccountURL':
                returnValue = record['AccountName'];
                break;
            default:
                returnValue = record[field];
                break;
        }
        return returnValue;
    }

    // * This method will be called whenever a table header is clicked for sorting
    handleSort(event) {
        console.log(JSON.parse(JSON.stringify(event.detail)));
        const { fieldName: sortedBy, sortDirection: sortedDirection } = event.detail;
        const clonedContacts = [...this.contacts];
        clonedContacts.sort(this.sortBy(sortedBy, sortedDirection === 'asc' ? 1 : -1, this.primer));
        this.contacts = clonedContacts;
        this.sortedBy = sortedBy;
        this.sortedDirection = sortedDirection;
    }

    // * This method will be called when a header action is clicked
    handleHeaderAction(event) {
        console.log(JSON.parse(JSON.stringify(event.detail)));
        const { action, columnDefinition } = event.detail;
        const contactColumns = this.contactColumns;
        const actions = contactColumns.find(contactColumn => contactColumn.fieldName === columnDefinition.fieldName)?.actions;
        if(actions) {
            actions.forEach(currentAction => {
                currentAction.checked = currentAction.name === action.name;
            });
            this.contactColumns = [...contactColumns];
            if(action.name === 'all') {
                this.contacts = this.originalContacts;
            } else {
                this.contacts = this.originalContacts.filter(contact => contact.LeadSource === action.label);
            }
        }
    }
}