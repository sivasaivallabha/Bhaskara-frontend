import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class AboutPage {

  type: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.url.subscribe(url => {
      this.type = url[1]?.path;  // about-us / head1 / head2
    });
  }

  getData() {
    if (this.type === 'about-us') {
      return [
        { title: 'About College', desc: 'Bhaskara is a leading institution...' },
        { title: 'Vision', desc: 'To empower students...' },
        { title: 'Mission', desc: 'Provide quality education...' }
      ];
    }

    if (this.type === 'head1') {
      return [
        { title: 'Chairman', desc: 'Details about chairman...' },
        { title: 'Experience', desc: '20+ years experience...' },
        { title: 'Achievements', desc: 'Award-winning leader...' }
      ];
    }

    if (this.type === 'head2') {
      return [
        { title: 'Principal', desc: 'Principal details...' },
        { title: 'Academic Excellence', desc: 'Top results every year...' },
        { title: 'Leadership', desc: 'Strong academic leadership...' }
      ];
    }

    return [];
  }
}