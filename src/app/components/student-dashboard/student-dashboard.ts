import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
import { Router } from '@angular/router';
@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports : [FormsModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css'
})
export class StudentDashboard implements OnInit {

  constructor(private cdr: ChangeDetectorRef,
              private router: Router
  ) {}

  student: any = null;

  ngOnInit() {
    this.getStudentData();
  }
  logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');

  alert("Logged out 👋");

  this.router.navigate(['/login']);
}

  getStudentData() {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:5000/api/student/me', {
      headers: { Authorization: token }
    })
    .then(res => {

      let s = res.data;

      // ✅ FIX SUBJECTS (old data support)
      if (!s.subjects || s.subjects.length === 0) {
        if (s.marks) {
          s.subjects = [
            { name: 'Maths', marks: s.marks.maths || 0 },
            { name: 'Physics', marks: s.marks.physics || 0 },
            { name: 'Chemistry', marks: s.marks.chemistry || 0 },
            { name: 'English', marks: s.marks.english || 0 }
          ];
        } else {
          s.subjects = [];
        }
      }

      this.student = s;
      this.calculateAttendance();
      this.cdr.detectChanges();
    })
    .catch(err => {
      console.error(err);
    });
  }



  selectedMonth: string = new Date().toISOString().slice(0, 7); // "2026-04"

monthlyAttendance: any[] = [];
monthlyPercentage: number = 0;
totalPercentage: number = 0;

calculateAttendance() {

  if (!this.student?.attendanceRecords) return;

  const records = this.student.attendanceRecords;

  const monthRecords = records.filter((r: any) =>
    r.date.startsWith(this.selectedMonth)
  );

  // 📅 GROUP BY DATE
  const grouped: any = {};

  monthRecords.forEach((r: any) => {
    if (!grouped[r.date]) {
      grouped[r.date] = { present: 0, total: 0 };
    }

    grouped[r.date].total++;

    if (r.status === 'Present') {
      grouped[r.date].present++;
    }
  });

  // ✅ DAILY LIST
  this.monthlyAttendance = Object.keys(grouped).map(date => {
    const d = grouped[date];

    return {
      date,
      present: d.present,
      total: d.total,
      percentage: Math.round((d.present / d.total) * 100)
    };
  });

  // ✅ MONTH %
  const totalPresent = monthRecords.filter((r: any) => r.status === 'Present').length;
  const totalCount = monthRecords.length;

  this.monthlyPercentage = totalCount
    ? Math.round((totalPresent / totalCount) * 100)
    : 0;

  // ✅ TOTAL %
  const allPresent = records.filter((r: any) => r.status === 'Present').length;
  const allCount = records.length;

  this.totalPercentage = allCount
    ? Math.round((allPresent / allCount) * 100)
    : 0;

}
}