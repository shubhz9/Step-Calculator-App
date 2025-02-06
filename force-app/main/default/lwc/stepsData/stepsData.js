import { LightningElement, wire, track } from 'lwc';
import getStepsData from '@salesforce/apex/Steps_CON.getStepsData';
import { loadScript } from 'lightning/platformResourceLoader';
import chartjs from '@salesforce/resourceUrl/chartjsv44';

export default class StepsData extends LightningElement {
    @track stepsData = [];
    chart;
    chartConfig;
    
    // Define table columns
    columns = [
        { label: 'Contact Name', fieldName: 'contactName', type: 'text' },
        { label: "Today's Steps", fieldName: 'todaysSteps', type: 'number' },
        { label: 'Total Steps', fieldName: 'totalSteps', type: 'number' },
        { label: 'Penalty', fieldName: 'penalty', type: 'number' },
        { label: 'Golden Points', fieldName: 'goldenPoint', type: 'number' }
    ];

    @wire(getStepsData)
    wiredSteps({ error, data }) {
        if (data) {
            this.processData(data);
        } else if (error) {
            console.error('Error fetching Steps data:', error);
        }
    }

    renderedCallback() {
        if (this.chartConfig && !this.chart) {
            loadScript(this, chartjs)
                .then(() => this.initializeChart())
                .catch(error => console.error('ChartJS loading error:', error));
        }
    }

    generateChartConfig() {
        const labels = this.stepsData.map(step => step.contactName);
        const stepCounts = this.stepsData.map(step => step.totalSteps);

        this.chartConfig = {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: "Today's Steps",
                    data: stepCounts,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };
    }

    initializeChart() {
        const ctx = this.template.querySelector('.chart').getContext('2d');
        this.chart = new Chart(ctx, this.chartConfig);
    }

    handleRefresh(event){
        console.log('@@-- ' + event);
        getStepsData()
            .then(data => {
                console.log('@@-- REFRESH DATA - ' + JSON.stringify(data));
                this.processData(data);
                // if (this.chart) {
                //     this.chart.destroy(); // Clear old chart
                //     this.initializeChart();
                // }
            })
            .catch(error => console.error('Error refreshing data:', error));
            console.log('@@-- SD - ' + JSON.stringify(this.stepsData));
    }

    processData(data) {
        this.stepsData = data.map(step => ({
            Id: step.Id,
            contactName: step.Contact__r ? step.Contact__r.Name : 'INVALID',
            todaysSteps: step.Todays_Steps__c,
            totalSteps: step.Total_Steps__c,
            penalty: step.Penalty__c,
            goldenPoint: step.Golden_Point__c
        }));
        this.generateChartConfig();
    }
}
