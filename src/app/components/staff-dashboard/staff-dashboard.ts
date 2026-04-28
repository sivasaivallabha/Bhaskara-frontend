import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './staff-dashboard.html',
  styleUrl: './staff-dashboard.css'
})
export class StaffDashboard implements OnInit {

  students: any[] = [];

  filters = {
    class: '',
    section: ''
  };

  classes: string[] = [
    '1st','2nd','3rd','4th','5th',
    '6th','7th','8th','9th','10th',
    '11th','12th'
  ];

  ngOnInit() {}

  // 🔥 GET STUDENTS
  // getStudents() {
  //   const token = localStorage.getItem('token');

  //   const params = new URLSearchParams(this.filters).toString();

  //   axios.get(`http://localhost:5000/api/student/all?${params}`, {
  //     headers: { Authorization: token }
  //   })
  //   .then(res => {
  //     this.students = res.data;
  //   });
  // }

  // ✏ UPDATE MARKS ONLY
  updateMarks(student: any) {
    const token = localStorage.getItem('token');

    axios.put(
      `http://localhost:5000/api/student/update/${student._id}`,
      { subjects: student.subjects }, // 🔥 ONLY SUBJECTS
      { headers: { Authorization: token } }
    )
    .then(() => {
      alert("Marks Updated ✅");
    });
  }

  searchText = '';
allStudents: any[] = [];

getStudents() {
  const token = localStorage.getItem('token');

  const params = new URLSearchParams(this.filters).toString();

  axios.get(`http://localhost:5000/api/student/all?${params}`, {
    headers: { Authorization: token }
  })
  .then(res => {
    this.students = res.data;
    this.allStudents = res.data; // backup
  });
}

filterStudents() {
  this.students = this.allStudents.filter(s =>
    s.name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
    s.rollNo?.toLowerCase().includes(this.searchText.toLowerCase())
  );
}
}