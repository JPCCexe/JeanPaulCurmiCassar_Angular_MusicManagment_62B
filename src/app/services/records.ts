import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Record } from '../models/record.dto';

@Injectable({
  providedIn: 'root'
})
export class RecordsService {
  private apiUrl = 'http://localhost:3000/records';

  constructor(private http: HttpClient) { }

  getRecords(): Observable<Record[]> {
    return this.http.get<Record[]>(this.apiUrl);
  }

  addRecord(record: Record): Observable<Record> {
    return this.http.post<Record>(this.apiUrl, record);
  }

  deleteRecord(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getRecordById(id: string): Observable<Record> {
    return this.http.get<Record>(`${this.apiUrl}/${id}`);
  }

  updateRecord(id: string, record: Record): Observable<Record> {
    return this.http.put<Record>(`${this.apiUrl}/${id}`, record);
  }
}
