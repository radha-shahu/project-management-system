import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() message: string = 'Loading...';
  @Input() overlay: boolean = false;

  get loaderClasses(): string {
    const classes = ['loader', `loader-${this.size}`];
    if (this.overlay) classes.push('loader-overlay');
    return classes.join(' ');
  }
}
