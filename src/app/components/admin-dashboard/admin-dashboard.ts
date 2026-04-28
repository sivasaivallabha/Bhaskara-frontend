import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {

  constructor(private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  students: any[] = [];
  searchText: string = '';

  // 🔥 FILTERS
  filters = {
    class: '',
    section: '',
    group: ''
  };
  applyFilters() {
    this.getStudents();
    this.loadExams(); // 🔥 IMPORTANT
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    alert("Logged out 👋");

    this.router.navigate(['/login']);
  }
  // 🔥 DROPDOWNS
  classes: string[] = [];
  sections: string[] = [];

  // ✅ FIXED GROUPS
  groups: string[] = ['MPC', 'BiPC', 'MEC-CPT'];

  // ✅ SUBJECT OPTIONS
  subjectOptions: string[] = [
    'Telugu',
    'Hindi',
    'English',
    'Maths',
    'Science',
    'Social',
    'Physics',
    'Chemistry',
    'Biology',
    'Zoology',
    'Botany'
  ];

  ngOnInit() {
    this.getStudents();
  }

  // 🔥 GET STUDENTS + FIX DATA
  getStudents() {

    const token = localStorage.getItem('token');

    const params = new URLSearchParams({
      ...this.filters,
      search: this.searchText
    }).toString();

    axios.get(`http://localhost:5000/api/student/all?${params}`, {
      headers: { Authorization: token }
    })
      .then(res => {

        console.log("RAW STUDENTS:", res.data); // 🔍 DEBUG

        this.students = res.data

          // ✅ REMOVE EMPTY / INVALID STUDENTS
          .filter((s: any) => s)

          // ✅ FORMAT DATA
          .map((s: any) => {

            // 🔹 SUBJECT FIX
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

            // 🔹 FEES FIX
            if (!s.fees) {
              s.fees = {
                schoolFee: 0,
                busFee: 0,
                concession1: 0,
                concession2: 0
              };
            }

            // 🔹 GROUP FIX
            if (!s.group) s.group = '';

            // 🔹 TEMP MARKS INIT (VERY IMPORTANT)
            s.tempMarks = [];

            return s;
          });

        console.log("FINAL STUDENTS:", this.students); // 🔍 DEBUG

        // ✅ CLASS LIST
        this.classes = [
          '1st', '2nd', '3rd', '4th', '5th',
          '6th', '7th', '8th', '9th', '10th',
          '11th', '12th'
        ];

        // ✅ UNIQUE SECTIONS
        this.sections = [
          ...new Set(this.students.map(s => s.section).filter(Boolean))
        ];

        this.cdr.detectChanges();

        // 🔥 LOAD EXAMS AFTER STUDENTS
        this.loadExams();

      })
      .catch(err => {
        console.error("Error fetching students:", err);
      });
    this.loadExamList();
  }
  // 🗑 DELETE
  deleteStudent(id: string) {
    const token = localStorage.getItem('token');

    axios.delete(`http://localhost:5000/api/student/delete/${id}`, {
      headers: { Authorization: token }
    })
      .then(() => {
        alert("Deleted ✅");
        this.getStudents();
      });
  }

  // ✏ UPDATE
  // updateStudent(student: any) {
  //   const token = localStorage.getItem('token');

  //   // 🔥 AUTO CALCULATE FEES
  //   const f = student.fees;

  //   student.totalFees =
  //     (f.schoolFee || 0) +
  //     (f.busFee || 0) -
  //     (f.concession1 || 0) -
  //     (f.concession2 || 0);

  //   student.due = student.totalFees - (student.feesPaid || 0);

  //   axios.put(
  //     `http://localhost:5000/api/student/update/${student._id}`,
  //     student,
  //     { headers: { Authorization: token } }
  //   )
  //     .then(() => {
  //       alert("Updated ✅");
  //     });

  //     this.getStudents();
  // }

updateStudent(student: any) {
  const token = localStorage.getItem('token');

  const f = student.fees;

  const school = Number(f.schoolFee) || 0;
  const bus = Number(f.busFee) || 0;
  const c1 = Number(f.concession1) || 0;
  const c2 = Number(f.concession2) || 0;
  const paid = Number(student.feesPaid) || 0;

  student.totalFees = school + bus - c1 - c2;
  student.due = student.totalFees - paid;

  axios.put(
    `http://localhost:5000/api/student/update/${student._id}`,
    student,
    { headers: { Authorization: token } }
  )
  .then(() => {
    alert("Updated ✅");
    this.getStudents();
  });
}




  // ➕ ADD SUBJECT
  addSubject(student: any) {
    if (!student.subjects) student.subjects = [];

    student.subjects.push({
      name: this.subjectOptions[0],
      marks: 0
    });
  }

  // ❌ REMOVE SUBJECT
  removeSubject(student: any, index: number) {
    student.subjects.splice(index, 1);
  }

  // calculateFees(student: any) {
  //   const f = student.fees;

  //   student.totalFees =
  //     (f.schoolFee || 0) +
  //     (f.busFee || 0) -
  //     (f.concession1 || 0) -
  //     (f.concession2 || 0);

  //   student.due = student.totalFees - (student.feesPaid || 0);
  // }
calculateFees(student: any) {
  const f = student.fees;

  const school = Number(f.schoolFee) || 0;
  const bus = Number(f.busFee) || 0;
  const c1 = Number(f.concession1) || 0;
  const c2 = Number(f.concession2) || 0;
  const paid = Number(student.feesPaid) || 0;

  student.totalFees = school + bus - c1 - c2;
  student.due = student.totalFees - paid;
}



  uploadPhoto(event: any, student: any) {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append('photo', file);

    axios.post(
      `http://localhost:5000/api/student/upload/${student._id}`,
      formData
    ).then(() => {
      this.getStudents();
    });
  }
  // 🔥 EXAM SYSTEM
  newExam = {
    name: '',
    class: '',
    section: '',
    group: '',
    subjects: [] as any[]
  };

  exams: any[] = [];
  selectedExam: any = null;
  // ➕ ADD SUBJECT TO EXAM
  addExamSubject() {
    this.newExam.subjects.push({
      name: '',
      maxMarks: 100
    });
  }

  // 📝 CREATE EXAM
  createExam() {
    axios.post('http://localhost:5000/api/exam/create', this.newExam)
      .then(() => {
        alert("Exam Created ✅");
        this.newExam = {
          name: '',
          class: '',
          section: '',
          group: '',
          subjects: []
        };
      });
  }

  // 📥 LOAD EXAMS
  loadExams() {

    const cls = this.filters.class;
    const section = this.filters.section;
    const group = this.filters.group;

    if (!cls || !section || !group) {
      console.log("❌ Filters not selected");
      return;
    }

    axios.get(`http://localhost:5000/api/exam/all?class=${cls}&section=${section}&group=${group}`)
      .then(res => {

        console.log("EXAMS:", res.data);

        this.exams = res.data;

        if (this.exams.length) {
          this.selectedExam = this.exams[0];
        } else {
          this.selectedExam = null;
        }

        this.cdr.detectChanges();
      });
  }

  // 💾 SAVE MARKS
  saveMarks(student: any) {

    const subjects = this.selectedExam.subjects.map((sub: any, i: number) => ({
      name: sub.name,
      maxMarks: sub.maxMarks,
      marksObtained: student.tempMarks[i] || 0
    }));

    axios.post(
      `http://localhost:5000/api/exam/marks/${student._id}`, // ✅ FIXED
      {
        examId: this.selectedExam._id,
        examName: this.selectedExam.name,
        subjects
      }
    ).then(() => {
      alert("Marks Saved ");
    });
  }

  saveAllMarks() {

    if (!this.selectedExam) {
      alert("Select Exam ❗");
      return;
    }

    const payload = this.students.map((s: any) => ({

      studentId: s._id,

      subjects: this.selectedExam.subjects.map((sub: any, i: number) => ({
        name: sub.name,
        maxMarks: sub.maxMarks,
        marksObtained: s.tempMarks[i] || 0
      }))

    }));

    axios.post(
      'http://localhost:5000/api/exam/marks/bulk',
      {
        examId: this.selectedExam._id,
        examName: this.selectedExam.name,
        students: payload
      }
    ).then(() => {
      alert("All Marks Saved ✅");
    });

  }

  announcementText: string = '';
  saveAnnouncement() {

    axios.post('http://localhost:5000/api/announcement/save', {
      text: this.announcementText
    })
      .then(() => {
        alert("Announcement Updated ✅");
        this.announcementText = '';
      });

  }
  downloadBasic() {
    this.downloadFile('download/basic', 'basic_details.xlsx');
  }

  downloadFees() {
    this.downloadFile('download/fees', 'fee_details.xlsx');
  }

  downloadFile(url: string, fileName: string) {
    const token = localStorage.getItem('token');

    axios.get(`http://localhost:5000/api/student/${url}`, {
      headers: { Authorization: token },
      responseType: 'blob'
    })
      .then(res => {

        const blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      });
  }


  examList: string[] = [];
  selectedExamName: string = '';
  loadExamList() {

    const params = new URLSearchParams({
      class: this.filters.class,
      section: this.filters.section,
      group: this.filters.group
    }).toString();

    axios.get(`http://localhost:5000/api/student/exams/list?${params}`)
      .then(res => {
        this.examList = res.data;
      });
  }

  downloadExamExcel() {

    if (!this.selectedExamName) {
      alert("Select Exam ❗");
      return;
    }

    const token = localStorage.getItem('token');

    const params = new URLSearchParams({
      class: this.filters.class,
      section: this.filters.section,
      group: this.filters.group,
      examName: this.selectedExamName
    }).toString();

    axios.get(`http://localhost:5000/api/student/download/exams?${params}`, {
      headers: { Authorization: token },
      responseType: 'blob'
    })
      .then(res => {

        const blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${this.selectedExamName}_report.xlsx`;
        link.click();

      });
  }
  resetPasswordMap: { [key: string]: string } = {};
  resetPassword(student: any) {

    const newPassword = this.resetPasswordMap[student._id];

    if (!newPassword) {
      alert("Enter new password ❗");
      return;
    }

    const token = localStorage.getItem('token'); // ✅ GET TOKEN

    axios.put(
      `http://localhost:5000/api/auth/reset-password/${student._id}`,
      { newPassword },
      {
        headers: { Authorization: token } // ✅ SEND TOKEN
      }
    )
      .then(() => {
        alert("Password Reset Successful ✅");
        this.resetPasswordMap[student._id] = '';
      })
      .catch(err => {
        console.error(err);
        alert("Error resetting password ❌");
      });
  }
  showPasswordMap: { [key: string]: boolean } = {};
}