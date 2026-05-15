import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Api } from '../../services/api';
import { Modal } from './components/modal/modal';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, Modal],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  user = signal<any | null>(null);
  clientfile = signal<any[]>([]);
  clientfileToCancel = signal<any | null>(null);
  private statusLabels: Record<string, string> = {
    Accepted: 'Accepté',
    Rejected: 'Rejeté',
    Pending: 'En cours de traitement',
    Canceled: 'Annulé',
  };
  private serviceLabels: Record<string, string> = {
    Leasing: 'Location',
    Sale: 'Vente',
  };

  constructor(private api: Api) { }

  ngOnInit() {
    this.api.getProfile().subscribe({
      next: (response) => {
        this.user.set(response.body);
      },
      error: (error) => {
        console.log(error);
      }
    });

    this.api.getMyClientfiles().subscribe({
      next: (response) => {
        this.clientfile.set(response.body || []);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getStatusLabel(status: string): string {
    return this.statusLabels[status] ?? status;
  }

  getServiceLabel(service: string): string {
    return this.serviceLabels[service] ?? service;
  }

  getStatusClass(status: string): string {
    if (status === 'Accepted') {
      return 'text-bg-success';
    }

    if (status === 'Rejected') {
      return 'text-bg-danger';
    }

    if (status === 'Canceled') {
      return 'text-bg-secondary';
    }

    return 'bg-light';
  }

  getPendingClientfiles() {
    return this.clientfile().filter((clientfile) => clientfile.status === 'Pending');
  }

  getPastClientfiles() {
    return this.clientfile().filter((clientfile) => clientfile.status !== 'Pending');
  }

  openCancelModal(event: Event, clientfile: any) {
    event.preventDefault();
    event.stopPropagation();
    this.clientfileToCancel.set(clientfile);
  }

  closeCancelModal() {
    this.clientfileToCancel.set(null);
  }

  cancelClientfile() {
    const clientfileToCancel = this.clientfileToCancel();

    if (!clientfileToCancel) {
      return;
    }

    this.api.cancelMyClientfile().subscribe({
      next: (response) => {
        this.clientfile.set(response.body);
        this.closeCancelModal();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
