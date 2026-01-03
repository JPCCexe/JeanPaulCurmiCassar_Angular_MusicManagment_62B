import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecordsService } from '../../services/records';
import { Record } from '../../models/record.dto';

@Component({
  selector: 'app-update-record',
  imports: [CommonModule, FormsModule],
  templateUrl: './update-record.html',
  styleUrl: './update-record.css',
})
export class UpdateRecord implements OnInit {
  // form data
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

  // store record id
  recordId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recordsService: RecordsService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.recordId = Number(id);
      this.loadRecord(this.recordId);
      this.loadFormats();
      this.loadGenres();
    }
  }

  // load record data
  loadRecord(id: number): void {
    this.recordsService.getRecordById(id).subscribe({
      next: (data) => this.record = data,
      error: (error) => console.error('Error loading record:', error)
    });
  }

  // load formats
  loadFormats(): void {
    this.recordsService.getFormats().subscribe({
      next: (data) => this.formats = data,
      error: (error) => console.error('Error loading formats:', error)
    });
  }

  // load genres
  loadGenres(): void {
    this.recordsService.getGenres().subscribe({
      next: (data) => this.genres = data,
      error: (error) => console.error('Error loading genres:', error)
    });
  }

  // save changes
  onSubmit(): void {
    this.recordsService.updateRecord(this.recordId, this.record).subscribe({
      next: () => this.router.navigate(['/records', this.recordId]),
      error: (error) => console.error('Error updating record:', error)
    });
  }

  // cancel
  onCancel(): void {
    this.router.navigate(['/records', this.recordId]);
  }
}