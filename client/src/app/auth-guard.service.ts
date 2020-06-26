import { Injectable } from '@angular/core'
import { Router, CanActivate } from '@angular/router'
import { AuthenticationService } from './authentication.service'

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private auth: AuthenticationService, private router: Router) {}

  canActivate() {
    if (!this.auth.isLogInUser() && !this.auth.isLogInAdmin() ){
      this.router.navigateByUrl('/')
      return false
    }
    return true
  }
}