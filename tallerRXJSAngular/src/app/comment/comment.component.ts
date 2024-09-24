import { Component, Input } from '@angular/core';
import { Comment } from '../model/Comment';

@Component({
  selector: 'app-comments',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentsComponent {
  @Input() comments!: Comment[];
}
