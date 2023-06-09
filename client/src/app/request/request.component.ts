import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../schedule.service';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../authentication.service';
import { AppComponent } from '../app.component';
import { Socket } from 'ngx-socket-io';

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
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {

  constructor(private scheduleService:ScheduleService, public toastr:ToastrService, public auth:AuthenticationService, public app:AppComponent, private socket: Socket) { }
  
  events:Event[]=[]
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

  searchValue: string = "";

  ngOnInit(): void {   
    this.loadEvents()

    if(this.auth.isLogInAdmin()){
      this.socket.on("newEvent", (name)=>{
        this.loadEvents()
      })
    }
  }

  public count:number
  loadEvents(): void {
    this.count=0
    this.events=[]
    this.scheduleService.getEvents().subscribe((data: {doc,err})=>{
      if(data.err){
        console.log("Error in fetching tasks")
      }else{
        data.doc.forEach(element => {
          if(element.status==="Pending"){
            this.events.push(element)
            this.count++
          }
        });
      }
    })
  }

  searchEvent() {
    this.count=0
    this.events=[]
    if (this.searchValue) {
      this.scheduleService.searchEvent(this.searchValue).subscribe((data: { err, doc }) => {
        if (data.err) {
          console.log("Error in fetching event")
        } else {
          if (this.auth.isLogInAdmin()) {
            this.events = []
            data.doc.forEach(element => {
              if (element.status === "Pending") {
                this.events.push(element)
                this.count++
              }
            });
          } else {
            this.events = JSON.parse(JSON.stringify(data.doc))
          }
        }
      })
    } else {
      this.loadEvents()
    }
  }

  editEvent(i:number): void {
    if(window.confirm("Are you sure you want to confirm the status?")){
      if(i===1){ this.event.status="Accepted"} else{ this.event.status="Denied"}
      this.scheduleService.editEvent(this.event._id, this.event.status, this.event.adminNote).subscribe((data:{error, doc})=>{
        if(data.error){
          this.toastr.error("Clash Found")
          this.loadEvents()
        }else{
          this.toastr.success("Status Updated Successfully!")
          this.loadEvents();
        }
      }) 
    }
  }
  view(index: number): void {
    this.event = this.events[index]
  }
}
