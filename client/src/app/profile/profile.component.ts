import { Component, OnInit } from '@angular/core';
import { AuthenticationService, UserDetails } from '../authentication.service';
import { ToastrService } from 'ngx-toastr';

interface UserDetail {
  _id: string
  email: string
  password: string
  name: string
  roles: string
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public temp:string

  constructor(public auth:AuthenticationService, private toastr:ToastrService) { }
  ngOnInit(): void {
    this.auth.profile().subscribe(
      user=>{
        this.details= user
      },
      err=>{
        console.error(err)
      }
    )
  }
  details: UserDetail= {
    _id: "",
    email: "",
    password: "",
    name: "",
    roles: ""
  }
  changePswd(id:string, pswd:string): void {
    if(window.confirm("Are you sure you want to change password")){
      if(this.details.password===this.temp){ 
        this.auth.changePswd(this.details._id, this.temp).subscribe((data:{error, doc})=>{
          if(data.error){
            this.toastr.error("Error in editing details")
          }else{
            this.toastr.success("Password Updated Successfully!")
          }
        }) 
      }else{
        this.toastr.error("Password must be equal")
      }
    }
    this.ngOnInit()
  }
}
