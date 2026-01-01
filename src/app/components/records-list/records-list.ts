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

  constructor(private recordsService: RecordsService, private router: Router) { }

  ngOnInit(): void {
    this.loadRecords();
  }

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

  viewDetails(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/records', id]);
    }
  }

  editRecord(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/records', id, 'edit']);
    }
  }

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

  navigateToCreate(): void {
    this.router.navigate(['/records/add']);
  }
}