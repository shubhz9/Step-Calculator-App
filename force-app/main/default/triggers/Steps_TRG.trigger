/**
 * @description       : Trigger for Step Object. 
 * @author            : Shubham Raut
 * @date              : 02-05-2025
 * @group             : ITBA
 * @last modified on  : 02-05-2025
 * @last modified by  : Shubham Raut
**/
trigger Steps_TRG on Steps__c (after update) {
    if(Trigger.isUpdate && Trigger.isAfter){
        UpdateTotalStepsAndPenalty_TRH.updateTotalStepsAndPenalty((List<Steps__c>)Trigger.New, (Map<Id, Steps__c>)Trigger.OldMap);
    }
}