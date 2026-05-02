import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule , RouterModule],
  templateUrl: './attendance.html',
  styleUrl: './attendance.css'
})
export class Attendance {

  students: any[] = [];

  filters = {
    class: '',
    section: '',
    group: ''
  };

  classes: string[] = [
    '1st','2nd','3rd','4th','5th',
    '6th','7th','8th','9th','10th',
    '11th','12th'
  ];

  groups: string[] = ['MPC', 'BiPC', 'MEC-CPT'];

  selectedPeriod: number = 1;
  today: string = new Date().toISOString().split('T')[0];

  // ✅ LOAD STUDENTS
  getStudents() {

    const token = localStorage.getItem('token');

    const params = new URLSearchParams(this.filters).toString();

    axios.get(`https://api.bhaskaraeducationalinstitutions.co.in/api/student/all?${params}`, {
      headers: { Authorization: token }
    })
    .then(res => {

      this.students = res.data.map((s: any) => {
        s.attendanceStatus = 'Present'; // default
        return s;
      });

    });
  }

  // ✅ SAVE ATTENDANCE
  saveAttendance() {

    const payload = this.students.map((s: any) => ({
      studentId: s._id,
      status: s.attendanceStatus
    }));

    axios.post(
      'https://api.bhaskaraeducationalinstitutions.co.in/api/student/attendance/bulk',
      {
        date: this.today,
        period: this.selectedPeriod,
        students: payload
      }
    ).then(() => {
      alert("Attendance Saved ✅");
    });

  }
}