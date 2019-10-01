import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewsComponent } from './Component/Maintenance/news/news.component';

const routes: Routes = [
  {path:"Maintenance/News",component:NewsComponent},
  {path:"**",component:NewsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
