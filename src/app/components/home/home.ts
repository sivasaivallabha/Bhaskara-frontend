import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {}
 ngOnInit() {
  this.getReviews();
  this.getAnnouncement();

  const role = localStorage.getItem('role');
  this.isAdmin = role === 'admin';
}
isAdmin = false;
deleteReview(id: string) {

  if (!confirm("Are you sure to delete this review?")) return;

  axios.delete(`http://3.110.143.33:5000/api/reviews/${id}`, {
    headers: {
      Authorization: localStorage.getItem('token')
    }
  })
  .then(() => {
    alert("Deleted successfully ✅");
    this.getReviews();
  })
  .catch(err => {
    console.error(err);
    alert("Only admin can delete ❌");
  });
}
getReviews() {
  axios.get('http://3.110.143.33:5000/api/reviews')
    .then(res => {
      this.reviews = res.data;
      this.cdr.detectChanges(); // 🔥 force UI update
    })
    .catch(err => {
      console.error(err);
    });
}

  currentSlide = 0;


  slides = [
    {
      image: 'assets/logo.png',
      title: 'Welcome to Bhaskara College',
      subtitle: 'Education is the most powerful weapon...',
      size: '70%',
      position: 'right 20% bottom 30% '
    },
    {
      image: 'assets/logo1.png',
      title: 'Admissions Open',
      subtitle: 'Join the Best Junior College',
      size: '45%',
      position: 'right 20% bottom 26%'
    },

    //  NEW SLIDE 1 - SCHOOL TOPPER
    {
      image: 'assets/schooltopper.png',   // 👈 add image
      title: 'School Topper 🏆',
      subtitle: 'Anjali Reddy - 10th Class | 598 / 600 Marks',
      size: '30%',
      position: 'right 20% bottom 30%'
    },

    // NEW SLIDE 2 - COLLEGE TOPPER
    {
      image: 'assets/collegetopper.png',  // 👈 add image
      title: 'College Topper 🎓',
      subtitle: 'Rahul Kumar - MPC | 985 / 1000 Marks',
      size: '30%',
      position: 'right 20% bottom 25%'
    }
  ];
  reviews: any[] = [];

  // reviews = [
  //   {
  //     name: 'Anjali Reddy',
  //     course: 'MPC - IIT JEE',
  //     image: 'assets/student1.jpg',
  //     comment: 'Excellent college with great faculty support. I achieved top marks because of their guidance.'
  //   },
  //   {
  //     name: 'Rahul Kumar',
  //     course: 'BiPC - NEET',
  //     image: 'assets/student2.jpg',
  //     comment: 'Best coaching for NEET preparation. Teachers are very supportive and experienced.'
  //   },
  //   {
  //     name: 'Sneha Sharma',
  //     course: 'MEC - CPT',
  //     image: 'assets/student3.jpg',
  //     comment: 'Good environment and strong academic focus. Highly recommend this institution.'
  //   }
  // ];
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }
  showCourses = false;
  showForm = false;

  openCourses() {
    this.showCourses = true;
  }

  closeCourses() {
    this.showCourses = false;
  }

  openForm() {
    this.showCourses = false; // close courses modal
    this.showForm = true;     // open form
  }

  closeForm() {
    this.showForm = false;
  }


  formData = {
    name: '',
    phone: '',
    email: '',
    city: '',
    course: '',
    marks: '',
    message: ''
  };

  submitForm() {
    axios.post('http://3.110.143.33:5000/api/apply', this.formData)
      .then(() => {
        alert("Application sent successfully 📧");
        this.closeForm();

        // reset form
        this.formData = {
          name: '',
          phone: '',
          email: '',
          city: '',
          course: '',
          marks: '',
          message: ''
        };
      })
      .catch(err => {
        console.error(err);
        alert("Failed to send application ❌");
      });
  }

  newReview: any = {
    name: '',
    course: '',
    comment: '',
    rating: 0,
    image: null
  };

  // ⭐ set rating
  setRating(value: number) {
    this.newReview.rating = value;
  }

  // 📸 file select
  onFileSelect(event: any) {
    this.newReview.image = event.target.files[0];
  }

  // 🚀 submit review
  addReview() {

  // 🚨 Basic validation (important)
  if (!this.newReview.name || !this.newReview.course || !this.newReview.comment || this.newReview.rating === 0) {
    alert("Please fill all fields and select rating ⭐");
    return;
  }

  const formData = new FormData();

  formData.append('name', this.newReview.name);
  formData.append('course', this.newReview.course);
  formData.append('comment', this.newReview.comment);
  formData.append('rating', this.newReview.rating.toString());

  if (this.newReview.image) {
    formData.append('image', this.newReview.image);
  }

  axios.post('http://3.110.143.33:5000/api/reviews', formData)
    .then(res => {

      console.log("Saved Review:", res.data);

      alert("Review added ✅");

      // 🔥 BEST PRACTICE → reload from DB
      this.getReviews();

      // 🧹 Reset form
      this.newReview = {
        name: '',
        course: '',
        comment: '',
        rating: 0,
        image: null
      };
    })
    .catch(err => {
      console.error("Error:", err);
      alert("Error adding review ❌");
    });
}

announcement: string = '';
getAnnouncement() {
  axios.get('http://3.110.143.33:5000/api/announcement/get')
    .then(res => {
      this.announcement = res.data?.text || '';
      this.cdr.detectChanges();
    });
}
}