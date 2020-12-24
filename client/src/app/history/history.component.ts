import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../schedule.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { AuthenticationService } from '../authentication.service';

interface Event {
  _id: string,
  name: string,
  user_id: string,
  title: string,
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string,
  description: string,
  classRoom: string,
  adminNote: string,
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
    user_id: "",
    title: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    description: "",
    classRoom: "",
    adminNote: "",
    status: ""
  }
  searchValue: string = ""

  constructor(private scheduleService: ScheduleService, private toastr: ToastrService, public auth: AuthenticationService) { }

  ngOnInit(): void {
    this.loadEvents()
  }

  loadEvents(): void {
    this.events = []
    this.scheduleService.getEvent().subscribe((data: { doc, err }) => {
      if (data.err) {
        console.log("Error in fetching tasks")
      } else {
        if (this.auth.isLogInAdmin()) {
          data.doc.forEach(element => {
            if (element.status != "Pending") {
              this.events.push(element)
            }
          });
        } else {
          this.events = data.doc as Event[]
        }
      }
    })
  }

  searchEvent() {
    if (this.searchValue) {
      this.scheduleService.searchEvent(this.searchValue).subscribe((data: { err, doc }) => {
        if (data.err) {
          console.log("Error in fetching event")
        } else {
          if (this.auth.isLogInAdmin()) {
            this.events = []
            data.doc.forEach(element => {
              if (element.status != "Pending") {
                this.events.push(element)
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

  deleteEvent(id: string): void {
    if (window.confirm("Are you sure you want to delete this event?")) {
      this.scheduleService.delEvent(id).subscribe((data: { err, doc }) => {
        if (!data.err) {
          this.loadEvents();
          this.toastr.success("Deleted Successfully")
        } else {
          this.toastr.error("Error in deleting event!")
        }
      })
    }
  }


  view(index: number): void {
    this.event = this.events[index]
  }

}
