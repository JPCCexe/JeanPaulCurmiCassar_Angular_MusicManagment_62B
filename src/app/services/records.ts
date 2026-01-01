import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Record } from '../models/record.dto';

import { switchMap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordsService {
  private apiUrl = 'http://localhost:3000/records';

  constructor(private http: HttpClient) { }

  // Get all records from API
  getRecords(): Observable<Record[]> {
    return this.http.get<Record[]>(this.apiUrl);
  }

  // Get single record by ID
  // For the View of the Records
  getRecordById(id: string): Observable<Record> {
    return this.http.get<Record>(`${this.apiUrl}/${id}`);
  }

  // Add new record with generated sequential id
  addRecord(record: Record): Observable<Record> {
    // Automatically generate sequential ID
    return this.getRecords().pipe(
      map(records => {
        const maxId = records.reduce((max, r) => {
          const numId = typeof r.id === 'string' ? parseInt(r.id, 10) : (r.id || 0);
          return numId > max ? numId : max;
        }, 0);
        return { ...record, id: String(maxId + 1) };
      }),
      switchMap(recordWithId => this.http.post<Record>(this.apiUrl, recordWithId))
    );
  }

  // Delete record by id
  deleteRecord(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateRecord(id: number | string, record: Record): Observable<Record> {
    return this.http.put<Record>(`${this.apiUrl}/${id}`, record);
  }

  // For The Add Records
  getFormats(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/formats');
  }

  getGenres(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/genres');
  }

  //For Login.ts

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/users');
  }

}
