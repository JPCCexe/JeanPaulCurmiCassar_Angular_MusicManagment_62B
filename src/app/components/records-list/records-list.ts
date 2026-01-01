import { Component, OnInit } from '@angular/core';
import { RecordsService } from '../../services/records';
import { Router } from '@angular/router';
import { Record } from '../../models/record.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-records-list',
  imports: [CommonModule],
  templateUrl: './records-list.html',
  styleUrl: './records-list.css',
})
export class RecordsList implements OnInit {
  protected records: Record[] = [];

  // store the user role for ermissions
  protected userRole: string = '';

  constructor(private recordsService: RecordsService, private router: Router) { }

  // Initializing component and load record data
  ngOnInit(): void {
    // get user role from localStorage
    this.userRole = localStorage.getItem('userRole') || '';
    this.loadRecords();
  }

  // Getting record details from API
  loadRecords(): void {
    this.recordsService.getRecords().subscribe({
      next: (data) => {
        this.records = data;
      },
      error: (error) => {
        console.error('Error fetching records:', error);
      }
    });
  }

  // go to record details page
  viewDetails(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/records', id]);
    }
  }

  // go to edit record page
  editRecord(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/records', id, 'edit']);
    }
  }

  // Delete record with confirmation
  deleteRecord(id: string | undefined): void {
    if (id && confirm('Are you sure you want to delete this record?')) {
      this.recordsService.deleteRecord(id).subscribe({
        next: () => {
          this.loadRecords();
        },
        error: (error) => {
          console.error('Error deleting record:', error);
        }
      });
    }
  }

  //Roles
  // check if user can update records
  canUpdate(): boolean {
    return this.userRole === 'Store Manager' || this.userRole === 'System Admin';
  }

  // check if user can delete records
  canDelete(): boolean {
    return this.userRole === 'System Admin';
  }


  navigateToCreate(): void {
    this.router.navigate(['/records/add']);
  }
}