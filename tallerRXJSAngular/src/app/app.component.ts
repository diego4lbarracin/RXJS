import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
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
    this.getPosts();
  }

  getPosts() {
    this.posts$ = this.http
      .get<{ posts: Post[] }>(`${this.ROOT_URL}posts/user/${this.txtUser}`)
      .pipe(map((response) => response.posts));

    this.posts$.subscribe((posts) => {
      console.log(posts);
      if (posts) {
        const postIds = posts.map((post) => post.id);
        this.getComments(postIds);
      }
    });
  }

  getComments(postIds: number[]) {
    const commentRequests = postIds.map((postId) =>
      this.http.get<Comment[]>(`${this.ROOT_URL}comments/post/${postId}`)
    );

    this.comments$ = forkJoin(commentRequests).pipe(
      map((commentArrays) => commentArrays.flat())
    );

    this.comments$.subscribe((comments) => {
      console.log(comments); // Log the comments to verify the structure
    });
  }
}
