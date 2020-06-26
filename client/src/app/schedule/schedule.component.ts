import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { ScheduleService } from '../schedule.service';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

interface Event {
	_id: string,
	name: string,
	user_id:string,
	title: string,
	startDate: string,
	startTime: string,
	endDate: string,
	endTime: string,
	description: string,
	classRoom: string,
	status: string
  }

@Component({
	selector: 'app-schedule',
	templateUrl: './schedule.component.html',
	styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit, AfterViewInit{

	constructor(private scheduleAPI: ScheduleService, private toastr: ToastrService) { }
	@ViewChild('cal', { static: false }) calendar: FullCalendarComponent
	calAPI
	ngOnInit(): void {

	}
	events: Event[] = []
	event: Event = {
		_id: "",
		name: "",
		user_id:"",
		title: "",
		startTime:"",
		startDate:"",
		endTime: "",
		endDate: "",
		description:"",
		classRoom: "",
		status: ""
	  }
	ngAfterViewInit(): void {
		$('#date').datetimepicker({})
		this.calAPI = this.calendar.getApi()
		this.loadData()
	}

	options: CalendarOptions = {
		plugins: [ resourceTimeGridPlugin ],
		initialView: 'resourceTimeGridDay',
		resources:[
			{
				id: 'G2',
				title: 'G2'
			  },
			  {
				id: 'G3',
				title: 'G3'
			  },
			  {
				id: 'G4',
				title: 'G4'
			  },
			  {
				id: 'G5',
				title: 'G5'
			  }
		]
	}

	loadData() {
		this.calAPI.removeAllEvents()
		this.scheduleAPI.getEvents().subscribe((data: any) => {
			if (data.doc) {
				data.doc.forEach(element => {
					if(element.status==="Accepted"){
						this.calAPI.addEvent({ title: element.title, start: element.startDate+"T"+element.startTime, end: element.endDate+"T"+element.endTime, resourceId:element.classRoom })
					}
				});
			}
		})
		this.calAPI.removeAllEvents()
	}

	addEvent(): void {
		const today = moment().format('YYYY-MM-DD');
		const mon=moment().month()+3
		const maxday=moment().month(mon).format('YYYY-MM-DD')
		console.log(maxday)
		if((this.event.startDate > this.event.endDate)|| (this.event.startTime>=this.event.endTime) || (this.event.startDate<=today) || (this.event.endDate>maxday)){ 
			this.toastr.error("Invalid Date and Time")
		}else{
		  this.scheduleAPI.addEvent( this.event.title, this.event.startTime, this.event.startDate, this.event.endTime, this.event.endDate, this.event.classRoom, this.event.description).subscribe((data:{error, doc})=>{
			if(data.error){
			  this.toastr.error("Error in adding new Event")
			}else{
			//   this.event = {
			// 	_id: "",
			// 	name: "",
			// 	user_id:"",
			// 	title: "",
			// 	startTime:"",
			// 	startDate:"",
			// 	endTime: "",
			// 	endDate: "",
			// 	description:"",
			// 	classRoom: "",
			// 	status: ""
			//   }
			  this.toastr.success('Request Sent Successfully!!')
			  //this.loadData();
			}
		  })
			this.cancel();
		}
	}	

	cancel(): void {
		this.event = {
			_id: "",
			name: "",
			user_id:"",
			title: "",
			startTime:"",
			startDate:"",
			endTime: "",
			endDate: "",
			description:"",
			classRoom: "",
			status: ""
		}
		this.loadData();
	}
}
