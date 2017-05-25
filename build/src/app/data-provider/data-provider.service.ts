import {Http, Response, RequestOptions, Headers} from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';
import {Router} from "@angular/router";

@Injectable()
export class DataProviderService {

	// UPDATE THIS VARIABLE IF API PATH CHANGED
	api_path:string = 'http://localhost/WAVE-PAYROLL-REPORT/api/api.php';

	constructor(private http : Http, private router: Router){ }


	requestOptions(_withFile:boolean = false): RequestOptions {
		let headers = new Headers();
		if(_withFile){
			headers.append('Accept', 'application/json');
		}
		return new RequestOptions({headers: headers});
	}

	getMaxUploadSize() {
		return this.http.post(this.api_path+"?action=GetMaxUploadSize", {}, this.requestOptions()).map((response:Response) => response.json());
	}

	uploadNewReport(formData: any){
		return this.http.post(this.api_path+"?action=UploadNewReport", formData, this.requestOptions(true)).map(res => res.json());
	}

	getReportData() {
		return this.http.post(this.api_path+"?action=GetReportData", {}, this.requestOptions()).map((response:Response) => response.json());
	}
}
