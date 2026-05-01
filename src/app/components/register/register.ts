import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  userData = {
    email: '',
    password: '',
    role: 'student'
  };

  register() {

    const token = localStorage.getItem('token');

    axios.post(
      'http://13.234.108.120:5000/api/auth/register',
      this.userData,
      {
        headers: {
          Authorization: token // 🔥 IMPORTANT
        }
      }
    )
    .then(() => {
      alert("User created ✅");

      this.userData = {
        email: '',
        password: '',
        role: 'student'
      };
    })
    .catch(err => {
      console.error(err);
      alert("Only admin can create users ❌");
    });
  }
}