import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'
import { FormsModule }  from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr'
import { FullCalendarModule } from '@fullcalendar/angular'
import dayGridPlugin from '@fullcalendar/daygrid';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { AuthGuardService } from './auth-guard.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { ScheduleService } from './schedule.service';
import { HistoryComponent } from './history/history.component';
import { RequestComponent } from './request/request.component';
import { ProfileComponent } from './profile/profile.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'event', component:ScheduleComponent, canActivate:[AuthGuardService]},
  { path:'history', component: HistoryComponent, canActivate:[AuthGuardService]},
  { path: 'request', component:RequestComponent, canActivate:[AuthGuardService]},
  { path:'profile', component:ProfileComponent, canActivate:[AuthGuardService]}
]

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin
]);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ScheduleComponent,
    HistoryComponent,
    RequestComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    ToastrModule.forRoot({timeOut:5000}),
    BrowserAnimationsModule,
    FullCalendarModule
  ],
  providers: [ ScheduleService, AuthGuardService, AuthenticationService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
