import { Component, OnInit, signal } from '@angular/core';
import { Api } from '../../../../services/api';

@Component({
  selector: 'app-gallery',
  imports: [],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery implements OnInit {
  cars = signal<any[]>([]);
  currentPage = 1;
  pageSize = 12;

  constructor(private apiService: Api) { }

  ngOnInit(): void {
    this.apiService.findAllCars().subscribe({
      next: (response) => {
        this.cars.set(Array.isArray(response.body) ? response.body : []);
      },
      error: (error) => console.log(error),
    });
  }

  getServiceLabel(service: string): string {
    if (service === 'Leasing') {
      return 'Location';
    }

    if (service === 'Sale') {
      return 'Vente';
    }

    return service;
  }

  getPagedCars(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;

    return this.cars().slice(start, start + this.pageSize);
  }

  getTotalPages(): number {
    return Math.ceil(this.cars().length / this.pageSize);
  }

  getPages(): number[] {
    const pages: number[] = [];

    for (let page = 1; page <= this.getTotalPages(); page++) {
      pages.push(page);
    }

    return pages;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.getTotalPages()) {
      return;
    }

    this.currentPage = page;
  }
}
