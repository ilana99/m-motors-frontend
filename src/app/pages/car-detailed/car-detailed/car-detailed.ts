import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../../../services/api';

@Component({
  selector: 'app-car-detailed',
  imports: [],
  templateUrl: './car-detailed.html',
  styleUrl: './car-detailed.scss',
})
export class CarDetailed implements OnInit {
  car = signal<any>('');
  constructor(private route: ActivatedRoute, private api: Api, public router: Router) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.api.findOneCar(id).subscribe({
        next: (response) => {
          this.car.set(response.body);
        },
        error: (error) => {
          console.log(error);
        }
      })
    }

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
}
