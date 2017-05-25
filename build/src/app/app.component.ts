import { Component, OnInit } from '@angular/core';
import {DataProviderService} from "./data-provider/data-provider.service";

@Component({
  selector: 'app-root',
  template: `
		<file-uploader (handleUpdate)="updateReportData($event)"></file-uploader>
		<report-table [reportData]="reportData"></report-table>
	`,
  styles: []
})
export class AppComponent implements OnInit  {
  title = 'WAVE :: Payroll Report 2000';
  reportData; // keep data here, as we need to update information between components

  constructor(private ds: DataProviderService) { }

// make an update once file be proceed
  updateReportData(_data){
	  this.reportData = _data;
  }

	ngOnInit() {
		// get data to start from 
		this.ds.getReportData().subscribe(result => {
			this.reportData = result.data.data;
		});
	}	

	
}
