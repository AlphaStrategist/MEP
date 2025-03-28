import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class AddProductComponent implements OnInit {
  addProductForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  user: any;

  categories: string[] = ['Food', 'Clothes', 'Medicine', 'Household'];

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

    this.addProductForm = this.fb.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      quantity: [
        '',
        [Validators.required, Validators.min(1), Validators.max(100)]
      ]
    });
  }

  onSubmit(): void {
    if (this.addProductForm.invalid) return;
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { productName, category, quantity } = this.addProductForm.value;

    this.http.post<any>('http://localhost:8000/api/products/add', {
      productName,
      category,
      quantity,
      userId: this.user.id
    })
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.successMessage = 'Product added successfully!';
          this.addProductForm.reset();
        },
        error: (err: HttpErrorResponse) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.message || 'Failed to add product.';
        }
      });
  }
}
