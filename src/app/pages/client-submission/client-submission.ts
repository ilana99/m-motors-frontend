import { Component, ElementRef, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../../services/api';

type SelectedFile = {
  file: File;
  url: string;
};

@Component({
  selector: 'app-client-submission',
  imports: [ReactiveFormsModule],
  templateUrl: './client-submission.html',
  styleUrl: './client-submission.scss',
})
export class ClientSubmission implements OnInit, OnDestroy {
  @ViewChild('identityCardInput') private identityCardInput?: ElementRef<HTMLInputElement>;
  @ViewChild('proofOfAddressInput') private proofOfAddressInput?: ElementRef<HTMLInputElement>;

  identityCardFile = signal<SelectedFile | null>(null);
  proofOfAddressFile = signal<SelectedFile | null>(null);
  user = signal<any | null>(null);
  car = signal<any | null>(null);
  submissionErrorMessage = signal('');

  submissionForm = new FormGroup({
    identityCard: new FormControl('', [Validators.required]),
    proofOfAddress: new FormControl('', [Validators.required]),
    insurance: new FormControl(false),
    roadsideAssistance: new FormControl(false),
    maintenance: new FormControl(false),
    technicalControl: new FormControl(false),
  });

  constructor(protected router: Router, private route: ActivatedRoute, private api: Api) { }

  ngOnInit(): void {
    const carId = this.route.snapshot.paramMap.get('id');

    if (!carId) {
      this.router.navigate(['/cars']);
      return;
    }

    this.api.findOneCar(carId).subscribe({
      next: (response) => {
        this.car.set(response.body);
      },
      error: (error) => {
        console.log(error);
      }
    });

    this.api.getProfile().subscribe({
      next: (response) => {
        this.user.set(response.body);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  ngOnDestroy(): void {
    this.clearIdentityCard(false);
    this.clearProofOfAddress(false);
  }

  getServiceLabel(service?: string): string {
    if (service === 'Leasing') {
      return 'Location';
    }

    if (service === 'Sale') {
      return 'Vente';
    }

    return service ?? '';
  }

  shouldShowError(controlName: keyof ClientSubmission['submissionForm']['controls']): boolean {
    const control = this.submissionForm.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  updateIdentityCard(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.clearIdentityCard(false);
    this.submissionForm.controls.identityCard.setValue(file?.name ?? '');
    this.submissionForm.controls.identityCard.markAsDirty();

    if (file) {
      this.identityCardFile.set({ file, url: URL.createObjectURL(file) });
    }
  }

  updateProofOfAddress(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.clearProofOfAddress(false);
    this.submissionForm.controls.proofOfAddress.setValue(file?.name ?? '');
    this.submissionForm.controls.proofOfAddress.markAsDirty();

    if (file) {
      this.proofOfAddressFile.set({ file, url: URL.createObjectURL(file) });
    }
  }

  removeIdentityCard(): void {
    this.clearIdentityCard();
    this.submissionForm.controls.identityCard.setValue('');
    this.submissionForm.controls.identityCard.markAsTouched();
  }

  removeProofOfAddress(): void {
    this.clearProofOfAddress();
    this.submissionForm.controls.proofOfAddress.setValue('');
    this.submissionForm.controls.proofOfAddress.markAsTouched();
  }

  submit(): void {
    this.submissionErrorMessage.set('');
    const carId = this.route.snapshot.paramMap.get('id');

    if (!carId) {
      this.router.navigate(['/cars']);
      return;
    }

    if (this.submissionForm.invalid || !this.identityCardFile() || !this.proofOfAddressFile()) {
      this.submissionForm.markAllAsTouched();
      return;
    }

    const value = this.submissionForm.getRawValue();
    const formData = new FormData();

    formData.append('carId', carId);
    formData.append('identityCard', this.identityCardFile()!.file, this.identityCardFile()!.file.name);
    formData.append('proofOfAddress', this.proofOfAddressFile()!.file, this.proofOfAddressFile()!.file.name);
    if (this.car()?.service === 'Leasing') {
      formData.append('insurance', String(value.insurance));
      formData.append('roadsideAssistance', String(value.roadsideAssistance));
      formData.append('maintenance', String(value.maintenance));
      formData.append('technicalControl', String(value.technicalControl));
    }

    this.api.submitClientFile(formData).subscribe({
      next: () => this.router.navigate(['/cars'], { queryParams: { submission: 'success' } }),
      error: (error) => {
        console.log(error);
        this.submissionErrorMessage.set(this.getSubmissionErrorMessage(error));
      },
    });
  }

  private getSubmissionErrorMessage(error: any): string {
    const message = error.error.message;

    if (message === 'User already has a pending clientfile') {
      return 'Vous avez déjà un dossier en attente.';
    }

    if (message === 'Car is not available') {
      return 'La voiture sélectionnée n`est plus disponible.';
    }

    return "Une erreur est survenue pendant l'envoi du dossier.";
  }

  private clearIdentityCard(resetInput = true): void {
    const selectedFile = this.identityCardFile();

    if (selectedFile) {
      URL.revokeObjectURL(selectedFile.url);
    }

    this.identityCardFile.set(null);

    if (resetInput && this.identityCardInput) {
      this.identityCardInput.nativeElement.value = '';
    }
  }

  private clearProofOfAddress(resetInput = true): void {
    const selectedFile = this.proofOfAddressFile();

    if (selectedFile) {
      URL.revokeObjectURL(selectedFile.url);
    }

    this.proofOfAddressFile.set(null);

    if (resetInput && this.proofOfAddressInput) {
      this.proofOfAddressInput.nativeElement.value = '';
    }
  }
}
