import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Post } from '../model/Post';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent {
  @Input() posts: Post[] = [];
  @Output() postSelected = new EventEmitter<number>();

  selectPost(postId: number) {
    this.postSelected.emit(postId);
  }
}
