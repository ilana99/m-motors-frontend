import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Api } from '../../../services/api';

@Component({
  selector: 'app-car-detailed',
  imports: [RouterLink],
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
          if (error.status === 404) {
            this.router.navigate(['/404']);
            return;
          }

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
