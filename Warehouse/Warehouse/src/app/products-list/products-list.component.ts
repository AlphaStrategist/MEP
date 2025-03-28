import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {
  products: any[] = [];
  errorMessage = '';
  isAdmin = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      this.router.navigate(['/login']);
      return;
    }
    const user = JSON.parse(storedUser);
    this.isAdmin = (user.role === 'admin');

    this.http.get<any[]>('http://localhost:8000/api/products/all')
      .subscribe({
        next: (response) => {
          this.products = response.map(p => this.processProduct(p));
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.error?.message || 'Failed to load products.';
        }
      });
  }

  processProduct(product: any): any {
    return {
      productName: product.productName,
      category: product.category,
      quantity: product.quantity,
      createdOn: this.formatDate(product.createdOn),
      updatedOn: this.formatDate(product.updatedOn),
      creator: product.creator ? product.creator.name : 'Unknown',
      id: product.id
    };
  }

  formatDate(dateValue: string | Date): string {
    if (!dateValue) return '';
    const d = new Date(dateValue);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  deleteProduct(id: number): void {
    if (!this.isAdmin) return;

    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    this.http.delete(`http://localhost:8000/api/products/${id}`)
      .subscribe({
        next: (response: any) => {
          this.products = this.products.filter(p => p.id !== id);
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.error?.message || 'Failed to delete product.';
        }
      });
  }
}
