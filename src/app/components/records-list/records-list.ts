import { Component, OnInit } from '@angular/core';
import { RecordsService } from '../../services/records';
import { Router } from '@angular/router';
import { Record } from '../../models/record.dto';
import { CommonModule } from '@angular/common';

// FOR PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// FOR EXCEL
import * as XLSX from 'xlsx';


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

  // view record details
  viewDetails(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/records', id]);
    }
  }

  // edit record
  editRecord(id: number | undefined): void {
    if (id && this.canUpdate()) {
      this.router.navigate(['/records', id, 'edit']);
    }
  }

  // delete record
  deleteRecord(id: number | undefined): void {
    if (id && this.canDelete() && confirm('Are you sure you want to delete this record?')) {
      this.recordsService.deleteRecord(id).subscribe({
        next: () => this.loadRecords(),
        error: (error) => console.error('Error deleting record:', error)
      });
    }
  }

  //Roles
  // check if user can update
  canUpdate(): boolean {
    return this.userRole === 'manager' || this.userRole === 'admin';
  }

  // check if user can delete
  canDelete(): boolean {
    return this.userRole === 'admin';
  }

  // check if user can add new records
  canAdd(): boolean {
    return this.userRole === 'manager' || this.userRole === 'admin';
  }


  navigateToCreate(): void {
    this.router.navigate(['/records/add']);
  }

  // Export records to PDF
  exportToPDF(): void {
    const doc = new jsPDF();

    // TItle inside of PDF
    doc.setFontSize(18);
    doc.text('Music Records', 14, 20);

    // Prepare table data
    const tableData = this.records.map(record => [
      String(record.id || ''),
      record.title || '',
      record.artist || '',
      record.format || '',
      record.genre || '',
      '€' + record.price,
      String(record.stockQty || 0)
    ]);

    // Creating the table
    autoTable(doc, {
      head: [['ID', 'Title', 'Artist', 'Format', 'Genre', 'Price', 'Stock']],
      body: tableData,
      startY: 30
    });

    // Save PDF
    doc.save('music-records.pdf');
  }

  // Export records to Excel
  exportToExcel(): void {
    // Prepare data
    const data = this.records.map(record => ({
      'ID': record.id,
      'Title': record.title,
      'Artist': record.artist,
      'Format': record.format,
      'Genre': record.genre,
      'Price': '€' + record.price,
      'Stock': record.stockQty,
      'Customer ID': record.customerId,
      'Customer Name': record.customerFirstName + ' ' + record.customerLastName
    }));

    // Create worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // Create workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Records');

    // Save file
    XLSX.writeFile(wb, 'music-records.xlsx');
  }



}
