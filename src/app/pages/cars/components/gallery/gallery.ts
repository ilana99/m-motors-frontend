import { Component, inject, OnInit, signal } from '@angular/core';
import { Api } from '../../../../services/api';
import { Router } from "@angular/router";

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery implements OnInit {
  cars = signal<any[]>([]);
  selectedService = signal('');
  selectedSearch = signal('');
  services = ['Leasing', 'Sale'];
  currentPage = 1;
  pageSize = 12;
  private router = inject(Router);

  constructor(private apiService: Api) { }

  ngOnInit(): void {
    this.apiService.findAllCars().subscribe({
      next: (response) => {
        this.cars.set(Array.isArray(response.body) ? response.body : []);
      },
      error: (error) => console.log(error),
    });
  }

  navigateToDetailedCarPage(carId: number) {
    this.router.navigate(['/cars', carId])
  }

  changeService(service: string) {
    this.selectedService.set(service);
    this.currentPage = 1;
  }

  changeSearch(search: string) {
    this.selectedSearch.set(search);
    this.currentPage = 1;
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

  getFilteredCars(): any[] {
    const service = this.selectedService();
    const search = this.selectedSearch().trim().toLowerCase();

    return this.cars().filter((car) => {
      const matchesService = !service || car.service === service;
      const matchesSearch = !search || `${car.brand} ${car.model}`.toLowerCase().includes(search);

      return matchesService && matchesSearch;
    });
  }

  getPagedCars(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;

    return this.getFilteredCars().slice(start, start + this.pageSize);
  }

  getTotalPages(): number {
    return Math.ceil(this.getFilteredCars().length / this.pageSize);
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
