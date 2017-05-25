import {HttpModule} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {DataProviderService} from "./data-provider.service";

@NgModule({
  imports:      [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule
  ],
  declarations: [

  ],
  exports:      [],
  providers:    [ DataProviderService ]
})
export class DataProviderModule { }

