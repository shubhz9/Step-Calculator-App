import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import doGetStepCompetitionContacts from '@salesforce/apex/Contact_CON.getStepCompetitionContacts'
import doUpsertSteps from '@salesforce/apex/Steps_CON.upsertSteps'

export default class AddStepScreen extends LightningElement {
    steps = '';
    goldenPoint = '';
    selectedContact = '';
    contactOptions = [];
    isLoading = false;

    @wire(doGetStepCompetitionContacts)
    getStepContacts({error, data}){
        if(data){
            console.log('@@-- data - ', data);
            this.contactOptions = data.map(contact => ({
                label: contact.Name,
                value: contact.Id
            }));
        }
        if(error){
            console.log('@@-- error - ', error);
            this.dispatchEvent( new ShowToastEvent({
                title: "Error",
                message: error.message,
                variant: "error"
            }))
        }
    }

    handleInputChangeTodaysSteps(event) {
        this.steps = event.target.value;
    }

    handleInputChangeGoldenPoint(event){
        this.goldenPoint = event.target.value;
    }

    handleContactChange(event){
        this.selectedContact = event.target.value;
    }

    async handleSave() {
        this.isLoading = true;
        const payload = this.getPayload();
        const response = await doUpsertSteps({payload: JSON.stringify(payload)});
        if(response && response === 'SUCCESS'){
            console.log(response);
            const evt = new ShowToastEvent({
                title:'Success',
                message: 'Successfully Inserted the records',
                type: 'success',
                mode: 'Sticky'
            });
            this.dispatchEvent(evt);
            this.isLoading = false;
        }else{
            const evt = new ShowToastEvent({
                title:'Error',
                message: 'Error while Upsertiung Record',
                type: 'error',
                mode: 'Sticky'
            });
            this.dispatchEvent(evt);
            this.isLoading = false;
        }
    }

    getPayload(){
        return {
            contact: this.selectedContact,
            todaysSteps: this.steps,
            goldenPoint: (this.goldenPoint && this.goldenPoint.length ? this.goldenPoint : 0) 
        }
    }
}
