import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { Supaservice } from '../../service/supaservice';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private supaservice: Supaservice = inject(Supaservice);
  isLoggedIn$ = this.supaservice.session$.pipe(map(session => !!session));
}
