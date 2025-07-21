import { LightningElement } from 'lwc';

export default class ContactDatatable extends LightningElement {

    employeeColumns = [
        { label: 'Employee Id', fieldName: 'employeeId' },
        { label: 'First Name', fieldName: 'firstName' },
        { label: 'Last Name', fieldName: 'lastName' },
        { label: 'Phone Number', fieldName: 'employeePhone', type: 'phone' },
        { label: 'Email Address', fieldName: 'employeeEmail', type: 'email' }
    ];

    employeeData = [
        {
            employeeId: '1',
            firstName: 'Richard',
            lastName: 'Hendricks',
            employeePhone: '(158) 389-2794',
            employeeEmail: 'richard@piedpiper.com'
        },
        {
            employeeId: '2',
            firstName: 'Jared',
            lastName: 'Dunn',
            employeePhone: '(518) 390-2749',
            employeeEmail: 'jared@piedpiper.com'
        },
        {
            employeeId: '3',
            firstName: 'Erlich',
            lastName: 'Bachman',
            employeePhone: '(815) 391-2974',
            employeeEmail: 'erlich.bachman@piedpiper.com'
        },
        {
            employeeId: '4',
            firstName: 'Monica',
            lastName: '',
            employeePhone: '(427) 481-3858',
            employeeEmail: 'monica@piedpiper.com'
        },
        {
            employeeId: '5',
            firstName: 'Laurie',
            lastName: 'Bream',
            employeePhone: '(609) 202-1930',
            employeeEmail: 'laurie.bream@piedpiper.com'
        },
        {
            employeeId: '6',
            firstName: 'Gilfoyle',
            lastName: '',
            employeePhone: '(747) 401-3761',
            employeeEmail: 'gilfoyle@piedpiper.com'
        },
        {
            employeeId: '7',
            firstName: 'Russ',
            lastName: 'Hanneman',
            employeePhone: '(752) 918-5091',
            employeeEmail: 'russ.hanneman@piedpiper.com'
        },
        {
            employeeId: '8',
            firstName: 'Gavin',
            lastName: 'Belson',
            employeePhone: '(504) 492-9118',
            employeeEmail: 'gavin.belson@piedpiper.com'
        }
    ];
}