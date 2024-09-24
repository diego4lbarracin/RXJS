import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from './model/User';
import { Post } from './model/Post';
import { Comment } from './model/Comment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Taller RXJS Angular';
  ROOT_URL = 'https://dummyjson.com/';
  user$: Observable<User | null> = of(null);
  posts$: Observable<Post[] | null> = of(null);
  comments$: Observable<Comment[] | null> = of(null);
  txtUser: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  getUser() {
    this.user$ = this.http.get<User>(`${this.ROOT_URL}users/${this.txtUser}`);
  }
}
