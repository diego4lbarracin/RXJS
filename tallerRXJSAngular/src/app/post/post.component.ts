import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../model/Post';
import { Comment } from '../model/Comment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() posts: Post[] = [];
  commentsMap: { [postId: number]: Comment[] } = {};
  commentsVisibleMap: { [postId: number]: boolean } = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.posts.forEach((post) => {
      this.commentsVisibleMap[post.id] = false;
      this.fetchComments(post.id).subscribe((comments) => {
        this.commentsMap[post.id] = comments;
      });
    });
  }

  fetchComments(postId: number): Observable<Comment[]> {
    return this.http
      .get<{ comments: Comment[] }>(
        `https://dummyjson.com/comments/post/${postId}`
      )
      .pipe(map((response) => response.comments));
  }

  toggleComments(postId: number) {
    this.commentsVisibleMap[postId] = !this.commentsVisibleMap[postId];
  }
}
