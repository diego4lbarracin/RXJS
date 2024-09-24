import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
  selectedPostId: number | null = null;
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  getUser() {
    this.errorMessage = null; // Reset error message
    this.user$ = this.http
      .get<User>(`${this.ROOT_URL}users/${this.txtUser}`)
      .pipe(
        catchError((error) => {
          this.errorMessage = 'User not found. Try again.';
          return of(null); // Return null observable in case of error
        })
      );
    this.getPosts();
  }

  getPosts() {
    this.posts$ = this.http
      .get<{ posts: Post[] }>(`${this.ROOT_URL}posts/user/${this.txtUser}`)
      .pipe(map((response) => response.posts));

    this.posts$.subscribe((posts) => {
      if (posts) {
        const postIds = posts.map((post) => post.id);
        this.getComments(postIds);
      }
    });
  }

  getComments(postIds: number[]) {
    const commentRequests = postIds.map((postId) =>
      this.http.get<{ comments: Comment[] }>(
        `${this.ROOT_URL}comments/post/${postId}`
      )
    );

    this.comments$ = forkJoin(commentRequests).pipe(
      map((responses) => responses.flatMap((response) => response.comments))
    );
  }

  onPostSelected(postId: number) {
    this.selectedPostId = postId;
    this.getComments([postId]);
  }
}
