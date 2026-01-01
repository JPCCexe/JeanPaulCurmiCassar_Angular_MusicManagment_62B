import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RecordsService } from '../../services/records';
import { Record } from '../../models/record.dto';


@Component({
  selector: 'app-record-details',
  imports: [CommonModule],
  templateUrl: './record-details.html',
  styleUrl: './record-details.css',
})
export class RecordDetails implements OnInit {
  record: Record | null = null;

  // store the user role
  userRole: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recordsService: RecordsService
  ) { }

  // Initializing component and load record data
  ngOnInit(): void {
    // get role from localStorage
    this.userRole = localStorage.getItem('userRole') || '';
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRecord(id);
    }
  }

  // Getting record details from API
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

  // go to edit page
  editRecord(): void {
    if (this.record?.id) {
      this.router.navigate(['/records', this.record.id, 'edit']);
    }
  }

  // Delete record with confirmation
  deleteRecord(): void {
    if (this.record?.id && confirm('Are you sure you want to delete this record?')) {
      this.recordsService.deleteRecord(this.record.id).subscribe({
        next: () => {
          this.router.navigate(['/records']);
        },
        error: (error) => {
          console.error('Error deleting record:', error);
        }
      });
    }
  }

  //Role
  // check if user can edit
  canUpdate(): boolean {
    return this.userRole === 'Store Manager' || this.userRole === 'System Admin';
  }

  // check if user can delete
  canDelete(): boolean {
    return this.userRole === 'System Admin';
  }

  goBack(): void {
    this.router.navigate(['/records']);
  }
}
