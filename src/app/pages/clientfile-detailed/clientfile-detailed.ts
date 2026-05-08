import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'app-clientfile-detailed',
  imports: [RouterLink],
  templateUrl: './clientfile-detailed.html',
  styleUrl: './clientfile-detailed.scss',
})
export class ClientfileDetailed implements OnInit {
  clientfile = signal<any | null>(null);
  private statusLabels: Record<string, string> = {
    Accepted: 'Accepté',
    Rejected: 'Rejeté',
    Pending: 'En cours de traitement',
    Canceled: 'Annulé',
  };

  constructor(private route: ActivatedRoute, private router: Router, private api: Api) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.api.findOneClientfile(id).subscribe({
        next: (response) => {
          this.clientfile.set(response.body);
        },
        error: (error) => {
          if (error.status === 404) {
            this.router.navigate(['/404']);
            return;
          }

          console.log(error);
        }
      });
    }
  }

  getStatusLabel(status: string): string {
    return this.statusLabels[status] ?? status;
  }

  getServiceLabel(service: string) {
    if (service === 'Leasing') {
      return 'Location';
    }

    if (service === 'Sale') {
      return 'Vente';
    }

    return service;
  }
}
