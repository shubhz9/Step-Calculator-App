/**
 * @description       : 
 * @author            : $username  Deloitte
 * @date              : 02-06-2025
 * @group             : ITBA
 * @last modified on  : 02-06-2025
 * @last modified by  : Shubham Raut
**/
public with sharing class Steps_SRV {
    public static Boolean upsertSteps(String payload) {
        if(String.isNotBlank(payload)){
            Steps_WRP.CreateStepsWrapper wrapper = (Steps_WRP.CreateStepsWrapper)JSON.deserialize(payload, Steps_WRP.CreateStepsWrapper.class);
            Steps__c singleRecord = new Steps__c();
            singleRecord.External_ID__c = generateExternalId(wrapper);
            singleRecord.Contact__c = wrapper.contact;
            singleRecord.Todays_Steps__c = wrapper.todaysSteps;
            singleRecord.Competition__c = wrapper.competition;
            if(wrapper.goldenPoint > 0)
                singleRecord.Golden_Point__c = wrapper.goldenPoint;
            
            Schema.SObjectField extField = Steps__c.Fields.External_ID__c;
            Database.upsert(singleRecord, extField, false);
            return true;
        }
        return false;
    }

    private static String generateExternalId(Steps_WRP.CreateStepsWrapper wrapper) {
        String externalId = '';
        externalId = 'EXT~' + wrapper?.competition +'~' + wrapper?.contact;
        return externalId;
    }
}