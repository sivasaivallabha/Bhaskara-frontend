import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import axios from 'axios';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  showLogin = true;

  constructor(private router: Router) {}
  ngOnInit() {
  const role = localStorage.getItem('role');

  if (role === 'admin') this.router.navigate(['/admin']);
  else if (role === 'staff') this.router.navigate(['/staff']);
  else if (role === 'student') this.router.navigate(['/student']);
}

  loginData = {
    email: '',
    password: ''
  };

 login() {
  axios.post('http://localhost:5000/api/auth/login', this.loginData)
    .then(res => {

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);

      this.isLoggedIn = true;
      this.isAdmin = res.data.role === 'admin';

      alert("Login successful ✅");

      // 🔥 CLOSE MODAL FIRST
      this.showLogin = false;

      // 🔥 THEN NAVIGATE
      const role = res.data.role;

      if (role === 'admin') {
        this.router.navigate(['/admin']).then(() => {
          window.location.reload(); 
        });
      } 
      else if (role === 'staff') {
          this.router.navigate(['/staff']).then(() => {
            window.location.reload(); 
          });
      } 
      else {
        this.router.navigate(['/student']).then(() => {
            window.location.reload(); 
          });
      }

    })
    .catch(() => alert("Invalid credentials ❌"));
}
}