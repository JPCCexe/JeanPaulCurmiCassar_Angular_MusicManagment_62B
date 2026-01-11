import { Component, OnInit } from '@angular/core';
import { RecordsService } from '../../services/records';
import { Router } from '@angular/router';
import { Record } from '../../models/record.dto';
import { CommonModule } from '@angular/common';

// FOR PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// FOR EXCEL
import * as ExcelJS from 'exceljs';



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

    doc.setFontSize(18);
    doc.text('Music Records', 14, 20);

    // Define genre colors 
    const genreColors: { [key: string]: [number, number, number] } = {
      'Rock': [255, 200, 200],
      'Pop': [200, 200, 255],
      'Jazz': [255, 255, 200],
      'Classical': [200, 255, 200],
      'Electronic': [255, 200, 255],
      'Hip-Hop': [255, 220, 200],
      'default': [240, 240, 240]
    };

    const tableData = this.records.map(record => [
      String(record.id || ''),
      record.title || '',
      record.artist || '',
      record.format || '',
      record.genre || '',
      '€' + record.price,
      String(record.stockQty || 0)
    ]);


    autoTable(doc, {
      head: [['ID', 'Title', 'Artist', 'Format', 'Genre', 'Price', 'Stock']],
      body: tableData,
      startY: 30,
      didParseCell: (data) => {

        // Apply colors to body of the rows
        if (data.section === 'body') {
          const genre = this.records[data.row.index].genre || 'default';
          const color = genreColors[genre] || genreColors['default'];
          data.cell.styles.fillColor = color;
        }
      }
    });

    doc.save('music-records.pdf');
  }

  // export to Excel with color coding by genre
  async exportToExcel(): Promise<void> {
    // Setting colours for every genre 
    const colors: { [key: string]: string } = {
      'Rock': 'FFC8DCFF',
      'Pop': 'FFFFC8DC',
      'Jazz': 'FFFFFFC8',
      'Hip-Hop': 'FFDCFFC8',
      'Classical': 'FFE6DCFF',
      'Electronic': 'FFFFDCC8',
      'Reggae': 'FFC8FFE6',
      'Alternative': 'FFF0F0F0'
    };

    // create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Records');

    // add headers for Columns
    worksheet.addRow(['ID', 'Title', 'Artist', 'Format', 'Genre', 'Price', 'Stock']);

    // add data with colors
    this.records.forEach(record => {
      const row = worksheet.addRow([
        record.id,
        record.title,
        record.artist,
        record.format,
        record.genre,
        '€' + record.price,
        record.stockQty
      ]);

      // color row by genre
      const color = colors[record.genre || ''] || 'FFFFFFFF';
      row.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
      });
    });

    // downloading excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'music-records.xlsx';
    link.click();
  }
}
