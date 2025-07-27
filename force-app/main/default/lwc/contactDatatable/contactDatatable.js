import { LightningElement } from 'lwc';
import getContacts from '@salesforce/apex/ContactDatatableController.getContacts';
import getContactsCount from '@salesforce/apex/ContactDatatableController.getContactsCount';

const constants = {
    PUBLIC_RELATIONS: 'Public Relations'
};

export default class ContactDatatable extends LightningElement {

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
            hideDefaultActions: true,
            wrapText: true,
            initialWidth: 120,
            editable: true
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
            hideDefaultActions: true,
            wrapText: true,
            initialWidth: 130,
            editable: true
        },
        {
            label: 'Phone',
            fieldName: 'Phone',
            type: 'phone',
            sortable: true,
            hideDefaultActions: true,
            wrapText: true,
            initialWidth: 120,
            editable: true
        },
        {
            label: 'Email',
            fieldName: 'Email',
            type: 'email',
            sortable: true,
            hideDefaultActions: true,
            wrapText: true,
            initialWidth: 220,
            editable: true
        },
        {
            label: 'Lead Source',
            fieldName: 'LeadSource',
            sortable: true,
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
            ],
            wrapText: true,
            initialWidth: 150,
            editable: true
        },
        {
            label: 'Street',
            fieldName: 'street',
            sortable: true,
            hideDefaultActions: true,
            wrapText: true,
            initialWidth: 150,
            editable: true
        },
        {
            label: 'City',
            fieldName: 'city',
            sortable: true,
            hideDefaultActions: true,
            wrapText: true,
            editable: true
        },
        {
            label: 'State',
            fieldName: 'state',
            sortable: true,
            hideDefaultActions: true,
            wrapText: true,
            editable: true
        },
        {
            label: 'Country',
            fieldName: 'country',
            sortable: true,
            hideDefaultActions: true,
            wrapText: true,
            editable: true
        },
        {
            label: 'PostalCode',
            fieldName: 'postalCode',
            sortable: true,
            hideDefaultActions: true,
            wrapText: true,
            editable: true
        },
        {
            type: 'action',
            typeAttributes: {
                rowActions: this.getRowActions,
                menuAlignment: 'auto'
            }
        }
    ];

    // * Table Data
    contacts = [];
    selectedRows = [];
    recordsLimit = 10;
    totalRecordsCount = 0;
    recordsFilter = {};
    enableInfiniteLoading = true;
    isLoading = false;
    draftValues = [];

    // * Sorting Attributes
    sortedBy = 'Name';
    sortedDirection = 'asc';
    defaultSortDirection = 'asc';

    // * This method will calculate row actions based on the row data and pass them in the callback method
    getRowActions(row, doneCallback) {

        // * Table row actions
        let rowActions = [
            {
                label: 'View',
                name: 'view',
                iconName: 'action:preview'
            },
            {
                label: 'Edit',
                name: 'edit',
                iconName: 'action:edit'
            }
        ];

        // * Provide delete option only when Lead Source is not equal to Public Relations
        if(row['LeadSource'] != constants.PUBLIC_RELATIONS) {
            rowActions.push({
                label: 'Delete',
                name: 'delete',
                iconName: 'action:delete'
            });
        }

        // * Simulating apex callout
        setTimeout(() => {
            // * Pass the row actions to the table once they're ready
            doneCallback(rowActions);
        }, 1000);
    }

    // * This method will be called when the component is inserted in the DOM
    connectedCallback() {
        // * Updating total records count and querying contacts
        this.updateTotalRecordsCount();
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
                this.contacts = [];
                delete this.recordsFilter[columnDefinition.fieldName];
                this.updateTotalRecordsCount();
            } else {
                this.contacts = this.contacts.filter(contact => contact.LeadSource === action.label);
                this.recordsFilter[columnDefinition.fieldName] = action.label;
                this.updateTotalRecordsCount();
            }
        }
    }

    // * This method will be called when a table row is selected
    handleRowSelection(event) {
        console.log(event.detail.selectedRows);
        this.selectedRows = event.detail.selectedRows.map(row => row.Id);
    }

    /*
    *   This method is used to load more contacts
    *   as the user scroll to the last record in the datatable
    */
    loadContacts() {
        console.log('querying contacts...');
        if(this.contacts.length < this.totalRecordsCount) {
            this.queryContacts();
        } else {
            this.enableInfiniteLoading = false;
        }
    }

    /*
    *   This method is used to update total records count according to the filters applied.
    *   It'll also call queryContacts() to query records
    */
    updateTotalRecordsCount() {
        this.enableInfiniteLoading = true;
        const that = this;
        getContactsCount({
            recordsFilter: this.recordsFilter
        })
        .then(count => {
            that.totalRecordsCount = count;
            that.queryContacts();
        })
        .catch(error => console.log(error));
    }

    // * This method is used to query contacts based on the limit, offset and filters applied by the user
    queryContacts() {
        const that = this;
        this.isLoading = true;
        // * Querying contacts
        getContacts({
            queryLimit: this.recordsLimit,
            queryOffset: this.contacts.length,
            recordsFilter: this.recordsFilter
        })
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
            const selectRows = that.contacts.length === 0;
            that.contacts = that.contacts.concat(contacts);
            // * Selecting first 3 rows only
            if(selectRows) {
                that.selectedRows = contacts.slice(0,3).map(contact => contact.Id);
            }
        })
        .catch(error => console.log(error))
        .then(() => {
            that.isLoading = false;
        });
    }

    // * This method will be called when inline editing is cancelled
    handleCancel(event) {
        console.log(JSON.parse(JSON.stringify(event.detail)));
    }

    /*
    *   This method will be called when a single or
    *   multiple cells are updated in datatable
    */
    handleCellUpdate(event) {
        console.log(JSON.parse(JSON.stringify(event.detail)));
    }

    /*
    *   This method will be called when save button is clicked
    *   during inline editing in the datatable
    */
    handleSave(event) {
        console.log(JSON.parse(JSON.stringify(event.detail)));
        this.draftValues = [];
    }

    /*
    *   This method will be called when inline editing is triggered
    *   from a separate event outside the datatable
    */
    triggerInlineEdit(event) {
        const dt = this.template.querySelector('lightning-datatable');
        dt.openInlineEdit();
    }
}