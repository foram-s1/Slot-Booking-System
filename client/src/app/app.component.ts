import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Socket } from 'ngx-socket-io';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(public auth: AuthenticationService, private socket: Socket, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.socket.on("newEvent", (name) => {
      if(this.auth.isLogInAdmin()){
        this.toastr.success(name + " has sent a new Request")
        this.auth.playSound()
      }
    });

    this.socket.on("eventStatusUpdate", (data) => {
      if(this.auth.isLogInUser() && this.auth.getUserDetails().name===data.name){
        if(data.status==="Denied"){
          if(data.adminNote){
            this.toastr.error("Reason: " + data.adminNote, "Your request is Rejected")
          } else{
            this.toastr.error("Reason not specified.", "Your request is Rejected")
          }
        }else{
          this.toastr.success("Your request is accepted")
        }
        this.auth.playSound()
      }
    })
    
  }
}