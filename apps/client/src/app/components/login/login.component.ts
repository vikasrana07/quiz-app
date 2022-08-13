import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { AlertService, AuthenticationService, LoaderService } from '../../_services';

@Component({
  selector: 'quiz-app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule
  ]
})

export class LoginComponent implements OnInit {
  loading = false;
  isSubmitted = false;
  loginForm: FormGroup | any;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private loaderService: LoaderService
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {

  }
  get formControls(): any { return this.loginForm.controls; }
  onSubmit() {
    this.isSubmitted = true;
    if (!this.loginForm.valid) {
      return;
    }
    this.loaderService.start();
    this.authenticationService.generateToken(this.formControls.username.value, this.formControls.password.value)
      //.pipe(first())
      .subscribe({
        next: () => {
          this.loaderService.stop();
          this.router.navigate(['/dashboard'])
        },
        error: (error) => {
          this.loaderService.stop();
          this.alertService.error(error);
        }
      });
  }
}
