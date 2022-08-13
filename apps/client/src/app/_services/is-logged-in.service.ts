import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "./authentication.service";

@Injectable({
  providedIn: 'root',
})
export class IsLoggedIn {
  constructor(
    private router: Router,
    private authService: AuthenticationService) {
  }

  resolve(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }
}
