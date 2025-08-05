import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-labs',
  imports: [ReactiveFormsModule],
  templateUrl: './labs.html',
  styleUrl: './labs.css'
})
export class Labs {

  colorCtrl = new FormControl()
  
}
