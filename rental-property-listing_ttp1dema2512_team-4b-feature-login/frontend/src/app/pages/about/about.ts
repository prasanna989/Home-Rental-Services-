import { Component } from '@angular/core';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-about',
  imports: [Footer],
  templateUrl:'./about.html',
  styleUrls: ['./about.css'],
  standalone: true
})
export class About {

}
