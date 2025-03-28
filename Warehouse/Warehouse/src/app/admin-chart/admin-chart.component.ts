import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-admin-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-chart.component.html',
  styleUrls: ['./admin-chart.component.scss']
})
export class AdminChartComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  chart: Chart | undefined;
  errorMessage = '';

  chartOptions: string[] = ['Main Chart'];
  selectedCategory: string = 'Main Chart';

  allProducts: any[] = [];
  labels: string[] = [];
  quantities: number[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      this.errorMessage = 'Not logged in.';
      return;
    }
    const user = JSON.parse(storedUser);
    if (user.role !== 'admin') {
      this.errorMessage = 'You are not authorized to view this page.';
      return;
    }

    this.http.get<any[]>('http://localhost:8000/api/products/all')
      .subscribe({
        next: (products) => {
          this.allProducts = products;
          const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
          this.chartOptions = ['Main Chart', ...uniqueCategories];
          this.updateChartData();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to load product data.';
        }
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.labels.length > 0) {
        this.createOrUpdateChart();
      }
    }, 500);
  }

  onCategoryChange(event: any): void {
    this.selectedCategory = event.target.value;
    this.updateChartData();
    this.createOrUpdateChart();
  }

  updateChartData(): void {
    if (this.selectedCategory === 'Main Chart') {

      const categoryMap: { [key: string]: number } = {};
      for (const product of this.allProducts) {
        const cat = product.category;
        categoryMap[cat] = (categoryMap[cat] || 0) + product.quantity;
      }
      this.labels = Object.keys(categoryMap);
      this.quantities = Object.values(categoryMap);
    } else {

      const filtered = this.allProducts.filter(p => p.category === this.selectedCategory);
      const productMap: { [key: string]: number } = {};
      for (const product of filtered) {
        const name = product.productName;
        productMap[name] = (productMap[name] || 0) + product.quantity;
      }
      this.labels = Object.keys(productMap);
      this.quantities = Object.values(productMap);
    }
  }

  createOrUpdateChart(): void {
    if (!this.chartCanvas) return;
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.chart) {

      this.chart.data.labels = this.labels;
      if (this.chart.data.datasets && this.chart.data.datasets.length > 0) {
        this.chart.data.datasets[0].data = this.quantities;
      }
      this.chart.update();
    } else {

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.labels,
          datasets: [{
            label: 'Product Quantity',
            data: this.quantities,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          indexAxis: 'y',
          scales: {
            x: { beginAtZero: true }
          }
        }
      });
    }
  }
}
