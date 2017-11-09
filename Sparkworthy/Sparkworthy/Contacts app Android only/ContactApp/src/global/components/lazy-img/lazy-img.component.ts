import { Component, Input } from '@angular/core';

/**
 * Component in charge of lazy load images and cache them
 */
@Component({
  selector: 'lazy-img',
  template: `
  <div text-center [ngClass]="{ 'placeholder': placeholderActive }">
    <img [inputSrc]="inputSrc" lazy-load (loaded)="placeholderActive = false" (error)="errorDisplay = true" [hidden]="errorDisplay"/>
      <img src="assets/Images/profile.jpg" [hidden]="!errorDisplay"/>
  </div>
  `
})
export class LazyImgComponent {

  @Input() inputSrc: string;
  public errorDisplay:boolean = false;

  public placeholderActive: boolean = true;

  // errorDisplay()
  // {
  //   this.placeholderActive = true;
  // }

}
