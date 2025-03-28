import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Set default values for testing
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.isSubmitting = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.http.post<any>('http://localhost:8000/api/auth/login', {email: this.loginForm.value.email , password: this.loginForm.value.password })
      .subscribe({
        next: (response) => {
          const { token, tokenExpiry, user } = response;
          localStorage.setItem('token', token);
          localStorage.setItem('tokenExpiry', tokenExpiry.toString());
          localStorage.setItem('user', JSON.stringify(user));

          this.router.navigate(['/profile']);
        },
        error: (err: HttpErrorResponse) => {
          this.isSubmitting = false;
          if (err.status === 401) {
            this.errorMessage = 'Invalid credentials. Please try again.';
          } else {
            this.errorMessage = 'An error occurred during login. Please try again later.';
          }
        }
      });
  }
}
