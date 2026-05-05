import { Component } from '@angular/core';
import { Gallery } from "./components/gallery/gallery";

@Component({
  selector: 'app-cars',
  imports: [Gallery],
  templateUrl: './cars.html',
  styleUrl: './cars.scss',
})
export class Cars {

}
