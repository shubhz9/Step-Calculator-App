import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import doGetStepCompetitionContacts from '@salesforce/apex/Contact_CON.getStepCompetitionContacts'
import doUpsertSteps from '@salesforce/apex/Steps_CON.upsertSteps'
import dogetCompetitions from '@salesforce/apex/Competition_CON.getCompetitions'

export default class AddStepScreen extends LightningElement {
    steps = '';
    goldenPoint = false;
    selectedContact = '';
    contactOptions = [];
    selectedCompetition = '';
    competitionOptions = [];
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

    @wire(dogetCompetitions)
    getCompetitions({data, error}){
        if(data){
            this.competitionOptions = data.map(competition => ({
                label: competition.Competition_Name__c,
                value: competition.Id
            }))
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

    handleCompetitionChange(event){
        this.selectedCompetition = event.target.value;
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
            this.clearValues();
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
            competition: this.selectedCompetition,
            contact: this.selectedContact,
            todaysSteps: this.steps,
            goldenPoint: this.goldenPoint ? 1 : 0
        }
    }

    clearValues(){
        this.selectedCompetition = '';
        this.selectedContact = '';
        this.steps = '';
        this.goldenPoint = false;
    }

    get cannotSaveRecord(){
        return !this.selectedCompetition ||
        !this.selectedContact ||
        !this.steps ||
        !this.selectedCompetition.length ||
        !this.selectedContact.length ||
        !this.steps.length;
    }
}
