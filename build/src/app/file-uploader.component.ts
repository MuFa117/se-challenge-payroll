import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {DataProviderService} from "./data-provider/data-provider.service";

@Component({
  selector: 'file-uploader',
  template: `
    <div class="d-flex justify-content-center">
  			<div class="card">	
				<div class="d-flex flex-column align-content-center"  *ngIf="UploadStatus === 'not-started'">
					Upload new report: 
					<div class="outline">
						<div class="align-self-center">
							<form>
								<label class="upload-button">
									<input type="file" (change)="fileChange($event)"  accept=".csv">
									<span>Choose report file</span>
								</label>
								<div class="text-center" *ngIf="selectedFile">Selected: <strong>{{ selectedFile.name }}</strong></div>
							</form>
						</div>
						
					</div>
					<div class="sub-text">
					Please note:
						<ul>
							<li>Accepted file type: <strong>.csv</strong></li>
							<li [ngClass]="{'error':maxSizeExceeded}">Maximum file size allowed by server: <strong>{{ maxFileSize }}</strong></li>
						</ul>
					</div>
				

					<button type="button" *ngIf="selectedFile && !maxSizeExceeded" class="btn btn-primary" (click)="uploadFile()"><i class="fa fa-upload" aria-hidden="true"></i> Upload File</button>
					<div *ngIf="maxSizeExceeded" class="error">Error: <br>Maximum size of selected file exceeded. <br>Please select different file.</div>
				</div>

				<div class="text-center" *ngIf="UploadStatus === 'started'">
					<i class='fa fa-spinner fa-spin' style="color: #74A9E8;font-size: 2rem;" aria-hidden='true'></i>
					<br><br>Uploading report.
				</div>
				<div class="text-center" *ngIf="UploadStatus === 'error'">
					<i class='fa fa-exclamation-circle' style="color: #c16769;font-size: 2rem;" aria-hidden='true'></i>
					<br><br>Error: {{ ErrorMessage }} 
					<br><br><button type="button" class="btn btn-primary" (click)="resetUpload()">Click here to try different file.</button>
				</div>
				<div class="text-center" *ngIf="UploadStatus === 'done'">
					<i class='fa fa-check-circle' style="color: #b4c897;font-size: 2rem;" aria-hidden='true'></i>
					<br><br>Done. Thank you. Report below has been updated.
					<br><br><button type="button" class="btn btn-primary" (click)="resetUpload()">Click here to upload another.</button>
				</div>

			</div>
  `,
  styles: [
	  `
	.card{
		max-width: 700px;
		width: 100%;
		padding: 1rem;
		margin: 1rem;
		min-height: 280px;
	}
	.error{
		color: #c16769;
	}
	.sub-text{
		font-size: 0.8rem;
	}
	.outline{
		border: 3px dashed #F4F8FA;
		padding: 2px;
		border-radius: 4px;
		margin-bottom: 20px;
	}
	.upload-button {
		display: block;
		color: #e18c26;
		font-weight: bold;
		font-size: 1.2rem;
		text-align: center;
		text-decoration: underline;
		margin: auto auto;
		background-color: #F4F8FA;
		border-radius: 4px;
		height:3rem;
		line-height: 3rem;
	}

	.upload-button input {
		display: none
	}

	.upload-button:hover {
		cursor: pointer
	}

	  `
  ]
})
export class FileUploaderComponent implements OnInit {

	maxFileSize = 0; // max file size to show for user
	maxFileSizeBytes = 0; // max file size in bytes to compare with user's file

	maxSizeExceeded = false; // guard if max file size exceeded

	@Output()
	handleUpdate = new EventEmitter(); // emitter, once user upload new file, to trigger report data update

	reportData; 
	
	selectedFile:File;

	UploadStatus: string = 'not-started';
	ErrorMessage: string = '';

	// start again, in case error/success 
	resetUpload(){
		this.UploadStatus = 'not-started';
		this.ErrorMessage = '';
		this.selectedFile = null;
	}

	// check file once chosen
	fileChange(event) {
		let fileList: FileList = event.target.files;
		if(fileList.length > 0) {
			let file: File = fileList[0];
			if(file.size > this.maxFileSizeBytes){
				this.maxSizeExceeded = true;
			} else {
				this.maxSizeExceeded = false;
				this.selectedFile = file;
			}
			
		}
	}

	// upload file to server and process. Once succed - receive in return list of new report data, send it over emitter
	uploadFile(){
		this.UploadStatus = 'started';
		var formData:FormData = new FormData();
		formData.append('userfile', this.selectedFile);

		this.ds.uploadNewReport(formData).subscribe(result => {
			if(result.data.status){
				//console.log('NEW REPORT DATA: ', result.data.newReport.data);
				this.reportData = result.data.newReport.data;
				this.handleUpdate.emit(this.reportData);
				this.UploadStatus = 'done';
			} else {
				this.UploadStatus = 'error';
				this.ErrorMessage = result.data.message;
			}
		});
	}

	constructor(private ds: DataProviderService) { }

	ngOnInit() {
		// get max file size from server
		this.ds.getMaxUploadSize().subscribe(result => {
			this.maxFileSize = result.data.humanized;
			this.maxFileSizeBytes = result.data.bytes;
			
		});
	}			
}
