import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = 'api/upload'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  uploadProfileImage(userId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(`${this.apiUrl}/${userId}/profile-image`, formData);
  }
}