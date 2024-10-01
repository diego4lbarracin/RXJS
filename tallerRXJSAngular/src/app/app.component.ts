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
  userId: number | null = null;
  constructor(private http: HttpClient) {}

  ngOnInit() {}

  getUser() {
    this.errorMessage = null; // Reset error message
    this.user$ = this.http
      .get<any>(`${this.ROOT_URL}users/filter?key=username&value=${this.txtUser}`)
      .pipe(
        map((response: any) => {
          const users = response.users;
          if (users.length === 0) {
            throw new Error('Username not found');
          }
          const user = users[0]; // Return the first (and only) element in the array
          this.userId = user.id; // Extract the id from the user object
          if (this.userId !== null) {
            this.getPosts(this.userId);
          }          return user;
        }),
        catchError((error) => {
          this.errorMessage = error.message;
          return of(null); // Return null observable in case of error
        })
      );
  }
  getPosts(userId: number) {
    this.posts$ = this.http
      .get<{ posts: Post[] }>(`${this.ROOT_URL}posts/user/${userId}`)
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
