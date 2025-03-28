import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  roles: string[] = ['cashier'];
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }
    this.isSubmitting = true;
    this.errorMessage = '';

    const userData = this.registerForm.value;

    this.http.post<any>('http://localhost:8000/api/auth/register', userData)
      .subscribe({
        next: (response) => {
          console.log('User registered:', response);
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Registration failed:', err);
          this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
        }
      });
  }
}
