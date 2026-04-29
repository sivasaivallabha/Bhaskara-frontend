import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})

export class HeaderComponent implements OnInit {
  constructor(private router: Router) {}
  showModal = false;
  modalType = '';

  ngOnInit() {
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.header-container');
      if (window.scrollY > 50) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    });

    const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

if (token) {
  this.isLoggedIn = true;
  this.isAdmin = role === 'admin';
}
  }

  showLogin = false;

loginData = {
  email: '',
  password: ''
};

isLoggedIn = false;
isAdmin = false;
openLogin() {
  this.showLogin = true;
}

closeLogin() {
  this.showLogin = false;
}
login() {
  axios.post('http://3.110.143.33:5000/api/auth/login', this.loginData)
    .then(res => {

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);

      this.isLoggedIn = true;
      this.isAdmin = res.data.role === 'admin';

      alert("Login successful ✅");

      this.closeLogin();
    })
    .catch(err => {
      console.error(err);
      alert("Invalid credentials ❌");
    });
}
logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');

  this.isLoggedIn = false;
  this.isAdmin = false;

  alert("Logged out 👋");
  this.router.navigate(['/']);
}

  goToContact() {
  this.router.navigate(['/']).then(() => {
    setTimeout(() => {
      const element = document.getElementById('contact-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200); // small delay to wait for page load
  });
}
goToHighlights() {
  this.router.navigate(['/']).then(() => {
    setTimeout(() => {
      const element = document.getElementById('impact-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200); // small delay to wait for page load
  });
}

  openModal(type: string) {
    this.modalType = type;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  getModalData() {

    if (this.modalType === 'about') {
      return [
        { title: 'Student Success', desc: 'We nurture talent and guide every student toward excellence.' },
        { title: 'Innovation', desc: 'Modern teaching methodologies and technology-driven learning.' },
        { title: 'Accessibility', desc: 'Quality education accessible to all students.' }
      ];
    }

    if (this.modalType === 'head1') {
      return [
        { title: 'Leadership', desc: 'Strong leadership guiding the institution forward.' },
        { title: 'Experience', desc: '20+ years of academic excellence.' },
        { title: 'Vision', desc: 'Focused on future-ready education.' }
      ];
    }

    if (this.modalType === 'head2') {
      return [
        { title: 'Discipline', desc: 'Maintaining high academic standards.' },
        { title: 'Guidance', desc: 'Personal mentoring for students.' },
        { title: 'Results', desc: 'Consistent top academic results.' }
      ];
    }

    return [];
  }

  menuOpen = false;

toggleMenu() {
  this.menuOpen = !this.menuOpen;
}
closeMenu() {
  this.menuOpen = false;
}
}