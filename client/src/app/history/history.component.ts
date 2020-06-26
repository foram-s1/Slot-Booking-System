import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../schedule.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { AuthenticationService } from '../authentication.service';

interface Event {
  _id: string,
  name: string,
  user_id:string,
  title: string,
  startDate:string,
  startTime: string,
  endDate:string,
  endTime: string,
  description: string,
  classRoom: string,
  adminNote:string,
  status: string
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})


export class HistoryComponent implements OnInit {

  events: Event[] = []
  adding: boolean = true
  editing: boolean = false
  event: Event = {
    _id: "",
    name: "",
    user_id:"",
    title: "",
    startDate:"",
    startTime:"",
    endDate:"",
    endTime: "",
    description:"",
    classRoom: "",
    adminNote:"",
    status: ""
  }

  constructor(private scheduleService:ScheduleService,  private toastr: ToastrService, public auth:AuthenticationService) { }

  ngOnInit(): void {
    this.loadEvents()
  }

  public count:number

  loadEvents(): void {
    this.count=0
    this.events=[]
    this.scheduleService.getEvent().subscribe((data: {doc,err})=>{
      if(data.err){
        console.log("Error in fetching tasks")
      }else{
        if(this.auth.isLogInAdmin()){
          data.doc.forEach(element => {
            if(element.status!="Pending"){
              this.events.push(element)
              this.count++
            }
          });
        }else{
          data.doc.forEach(element => {
              this.events.push(element)
              this.count++
          });
        }
      }
    })
  }

  searchEvent(): void {
    this.count=0
    this.events=[]
    if(this.event.title){
      this.scheduleService.searchEvent(this.event.title).subscribe((data:{error,doc})=>{
        if(data.error){
          console.log("Error in fetching event")
        }else{
          data.doc.forEach(element => {
            if(element.status!="Pending"){
              this.events.push(element)
            this.count++
            }
          });
        }
      })
    }else{
      this.loadEvents()
    }
  }

  deleteEvent(id: string): void {
    if(window.confirm("Are you sure you want to delete this event?")){
      this.scheduleService.delEvent(id).subscribe((data: {err, doc})=>{
        if(!data.err){
          this.loadEvents();
          this.toastr.success("Deleted Successfully")
        }else{
          this.toastr.error("Error in deleting event!")
        }
      })
    }
  }


  view(index: number): void {
    this.event = this.events[index]
  }

}
