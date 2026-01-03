import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecordsService } from '../../services/records';
import { Record } from '../../models/record.dto';

@Component({
  selector: 'app-add-record',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-record.html',
  styleUrl: './add-record.css',
})
export class AddRecord implements OnInit {

  record: Record = {
    title: '',
    artist: '',
    format: '',
    genre: '',
    releaseYear: 0,
    price: 0,
    stockQty: 0,
    customerId: '',
    customerFirstName: '',
    customerLastName: '',
    customerContact: '',
    customerEmail: ''
  };

  // dropdown options
  formats: string[] = [];
  genres: string[] = [];

  constructor(
    private recordsService: RecordsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFormats();
    this.loadGenres();
  }

  // load formats for dropdown
  loadFormats(): void {
    this.recordsService.getFormats().subscribe({
      next: (data) => this.formats = data,
      error: (error) => console.error('Error loading formats:', error)
    });
  }

  // load genres for dropdown
  loadGenres(): void {
    this.recordsService.getGenres().subscribe({
      next: (data) => this.genres = data,
      error: (error) => console.error('Error loading genres:', error)
    });
  }

  onSubmit(): void {
    this.recordsService.addRecord(this.record).subscribe({
      next: () => this.router.navigate(['/records']),
      error: (error) => console.error('Error adding record:', error)
    });
  }

  // cancel and go back
  onCancel(): void {
    this.router.navigate(['/records']);
  }
}