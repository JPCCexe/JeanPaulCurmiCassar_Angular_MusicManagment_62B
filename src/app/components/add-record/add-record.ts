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

  // Initialising empty record objects
  protected record: Record = {
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

  // Storing format and genre options
  protected formats: any[] = [];
  protected genres: any[] = [];

  constructor(
    private recordsService: RecordsService,
    private router: Router
  ) { }

  // Load dropdown data on component initialization
  ngOnInit(): void {
    this.loadFormats();
    this.loadGenres();
  }


  // getting avaialable formats from API
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

  // getting avaialable genres from API
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

  onSubmit(): void {
    this.recordsService.addRecord(this.record).subscribe({
      next: () => {
        this.router.navigate(['/records']);
      },
      error: (error) => {
        console.error('Error adding record:', error);
      }
    });
  }

  //Go back to the record list route
  onCancel(): void {
    this.router.navigate(['/records']);
  }
}