import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routerModule } from './app.routing';


import { AppComponent } from './app.component';
import { DataProviderModule } from "./data-provider/data-provider.module";
import { FileUploaderComponent } from './file-uploader.component';
import { ReportTableComponent } from './report-table.component';

@NgModule({
  declarations: [
    AppComponent,
    FileUploaderComponent,
    ReportTableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
	DataProviderModule,
	routerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
