import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';


@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private http: HttpClient, private auth:AuthenticationService) {}

  getEvent(){
    return this.http.get('/api/event', {
      headers: {
        Authorization : `${this.auth.getToken()}`
      }
    })
  }
  
  getEvents(){
    return this.http.get('/api/event/get', {
      headers: {
        Authorization : `${this.auth.getToken()}`
      }
    })
  }

  addEvent(title: string,startTime: string, startDate: string, endTime: string, endDate: string, classRoom:string, description:string) {
    return this.http.post('/api/event/add',{title: title, startTime: startTime, startDate: startDate, endTime:endTime, endDate:endDate, classRoom: classRoom, description: description},{
      headers: {
        Authorization: `${this.auth.getToken()}`
      }
    })
  }

  editEvent(_id: string, status:string, adminNote:string) {
    return this.http.put('/api/event/'+_id,{status:status, adminNote: adminNote},{
      headers:{
        Authorization: `${this.auth.getToken()}`
      }
    })
  }

  searchEvent(title: string) {
    return this.http.post('/api/event/search',{title: title},{
      headers: {
        Authorization: `${this.auth.getToken()}`
      }
    })
  }

  delEvent(id:string){
    return this.http.delete('/api/event/'+id,{
      headers:{
        Authorization: `${this.auth.getToken()}`
      }
    })
  }
  
}
