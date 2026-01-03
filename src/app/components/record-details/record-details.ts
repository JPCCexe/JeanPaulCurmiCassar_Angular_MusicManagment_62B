import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RecordsService } from '../../services/records';
import { Record } from '../../models/record.dto';
import { StockStatusPipe } from '../../pipes/stock-status-pipe';


@Component({
  selector: 'app-record-details',
  imports: [CommonModule, StockStatusPipe],
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
    this.userRole = localStorage.getItem('userRole') || '';
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRecord(Number(id));
    }
  }
  // Getting record details from API
  loadRecord(id: number): void {
    this.recordsService.getRecordById(id).subscribe({
      next: (data) => this.record = data,
      error: (error) => console.error('Error loading record:', error)
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
  // check if user can update
  canUpdate(): boolean {
    return this.userRole === 'manager' || this.userRole === 'admin';
  }

  // check if user can delete
  canDelete(): boolean {
    return this.userRole === 'admin';
  }

  goBack(): void {
    this.router.navigate(['/records']);
  }
}
