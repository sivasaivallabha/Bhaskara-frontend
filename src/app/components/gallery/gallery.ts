import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import axios from 'axios';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css'
})
export class Gallery implements OnInit {

  constructor(private cdr: ChangeDetectorRef) {}

  images: any[] = [];
  selectedFile: any = null;
  selectedImage: string | null = null;

  isAdmin = false;

  ngOnInit() {
    this.getImages();

    const role = localStorage.getItem('role');
    this.isAdmin = role === 'admin';
  }

  // 🔥 GET IMAGES
  getImages() {
    axios.get('http://13.234.108.120:5000/api/gallery')
      .then(res => {
        this.images = res.data;
        this.cdr.detectChanges();
      })
      .catch(err => console.error(err));
  }

  // 📸 FILE SELECT
  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // 🚀 UPLOAD
  uploadImage() {
    if (!this.selectedFile) {
      alert("Select image first ❌");
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    axios.post('http://13.234.108.120:5000/api/gallery', formData)
      .then(() => {
        alert("Uploaded ✅");
        this.getImages();
        this.selectedFile = null;
      })
      .catch(err => console.error(err));
  }

  // 🗑 DELETE
  deleteImage(id: string) {
    if (!confirm("Delete this image?")) return;

    axios.delete(`http://13.234.108.120:5000/api/gallery/${id}`)
      .then(() => {
        alert("Deleted ✅");
        this.getImages();
      })
      .catch(err => console.error(err));
  }

  // 🔍 OPEN IMAGE
  openImage(img: string) {
    this.selectedImage = img;
    this.cdr.detectChanges();
  }

  // ❌ CLOSE
  closeImage() {
    this.selectedImage = null;
  }
}