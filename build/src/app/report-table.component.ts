import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'report-table',
  template: `
      <div class="d-flex d-row justify-content-center">

		<table class="table report-table">
				<thead>
					<tr>
						<th>Employee ID</th>
						<th>Pay Period</th>
						<th>Amount Paid</th>				
					</tr>
				</thead>
				<tbody>
					<ng-container *ngIf="reportData">
						<tr *ngFor='let period of reportData'>
							<td>{{ period.employeeID }}</td>
							<td>{{ period.PayPeriod }}</td>				
							<td>{{ '$'+period.Paid }}</td>														
						</tr>
					</ng-container> 
					<tr colspan="3" *ngIf="reportData?.length === 0">
						<td>No reports available. Upload new report to see summary.</td>
					</tr>
				</tbody>
			</table>
		</div>
  `,
  styles: [
	  `
	  .report-table{
			border-radius: 3px;
			border-style: solid;
			border-width: 1px;
			border-color:  #bacddf;
			background-color:  #ffffff;
			color:  #22364c;
			font-size:1rem;
			text-align: left;
			border-spacing: 0;
			border-collapse:separate;
			max-width: 700px;
			width: 100%;
		}

		.report-table thead{
			background-color:  rgba(90, 155, 229, 0.2);
			font-family: Hind;
			color:  #6e8baa;
			font-size: 0.75rem;
			font-weight: 500;
			text-align: left;
			
		}
		.report-table thead th{
			white-space: nowrap;
		}

		.report-table tbody tr:hover{
			background-color: #fdf5e2;
		}
	
		.report-table tbody tr:hover td.flat{
			text-decoration: none;
		}
		.report-table tbody tr td:first-child{
			border-left: 3px solid #fff;
		}
		.report-table tbody tr:hover td:first-child{
			border-left: 3px solid #f3cb6a;
		}
	  `
  ]
})
export class ReportTableComponent implements OnInit {

  constructor() { }

  @Input()
  reportData;

  ngOnInit() {
  }

}
