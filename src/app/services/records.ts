import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Record } from '../models/record.dto';

@Injectable({
  providedIn: 'root'
})
export class RecordsService {

  // API URL for backend
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Get all records from API
  getRecords(): Observable<Record[]> {
    return this.http.get<Record[]>(`${this.apiUrl}/records`);
  }

  // Get single record by ID
  // For the View of the Records
  getRecordById(id: number): Observable<Record> {
    return this.http.get<Record>(`${this.apiUrl}/records/${id}`);
  }

  // Add new record
  addRecord(record: Record): Observable<Record> {
    return this.http.post<Record>(`${this.apiUrl}/records`, record);
  }

  // Delete record by id
  deleteRecord(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/records/${id}`);
  }

  // Update record by id
  updateRecord(id: number, record: Record): Observable<Record> {
    return this.http.put<Record>(`${this.apiUrl}/records/${id}`, record);
  }

  // For The Add Records
  getFormats(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/formats`);
  }

  // For The Add Records
  getGenres(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/genres`);
  }

  // For Login
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
  }
}