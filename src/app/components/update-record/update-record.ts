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

  // Initialising empty record objects
  record: Record = {
    recordTitle: '',
    artist: '',
    format: '',
    genre: '',
    releaseYear: 0,
    price: 0,
    stockQuantity: 0,
    customerId: '',
    customerFirstName: '',
    customerLastName: '',
    customerContactNumber: '',
    customerEmail: ''
  };


  // Storing dropdown options and record id
  formats: any[] = [];
  genres: any[] = [];
  recordId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recordsService: RecordsService
  ) { }


  // laod reco data and dropdown option ON initilise 
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.recordId = id;
      this.loadRecord(id);
      this.loadFormats();
      this.loadGenres();
    }
  }

  // get existing record data from API
  loadRecord(id: string): void {
    this.recordsService.getRecordById(id).subscribe({
      next: (data) => {
        this.record = data;
      },
      error: (error) => {
        console.error('Error loading record:', error);
      }
    });
  }

  // get existing formats data from API
  loadFormats(): void {
    this.recordsService.getFormats().subscribe({
      next: (data) => {
        this.formats = data;
      },
      error: (error) => {
        console.error('Error loading formats:', error);
      }
    });
  }

  // get existing genres data from API
  loadGenres(): void {
    this.recordsService.getGenres().subscribe({
      next: (data) => {
        this.genres = data;
      },
      error: (error) => {
        console.error('Error loading genres:', error);
      }
    });
  }

  // Submit updated record to API
  onSubmit(): void {
    this.recordsService.updateRecord(this.recordId, this.record).subscribe({
      next: () => {
        this.router.navigate(['/records', this.recordId]);
      },
      error: (error) => {
        console.error('Error updating record:', error);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/records', this.recordId]);
  }
}