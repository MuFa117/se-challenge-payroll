import { RouterModule, Routes } from '@angular/router';
import { AppComponent }  from './app.component';



const routesConfig:Routes = []

export const routerModule = RouterModule.forRoot(routesConfig,{
  enableTracing: true,
  useHash: false
})