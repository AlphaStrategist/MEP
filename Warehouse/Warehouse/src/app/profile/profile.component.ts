import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  user: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.user = JSON.parse(storedUser);

    this.profileForm = this.fb.group({
      name: [this.user.name, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { name, email } = this.profileForm.value;

    this.http.post<any>('http://localhost:8000/api/user/update', {
      id: this.user.id,
      name,
      email
    })
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.successMessage = 'Profile updated successfully.';

          this.user.name = name;
          this.user.email = email;
          localStorage.setItem('user', JSON.stringify(this.user));
        },
        error: (err: HttpErrorResponse) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.message || 'Failed to update profile.';
        }
      });
  }
}
