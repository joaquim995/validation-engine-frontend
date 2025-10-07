import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ValidationRuleData {
  id?: string;
  object_type: string;
  expression: string;
  error_message: string;
  is_active: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ValidationRequest {
  object_type: string;
  form_data: { [key: string]: any };
}

export interface ValidationResponse {
  success: boolean;
  errors: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ValidationRuleService {
  private apiUrl = environment.apiUrl;
  private rulesSubject = new BehaviorSubject<ValidationRuleData[]>([]);

  constructor(private http: HttpClient) {}

  validateForm(request: ValidationRequest): Observable<ValidationResponse> {
    return this.http.post<ValidationResponse>(`${this.apiUrl}/evaluate`, request, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  getRules(): Observable<ValidationRuleData[]> {
    return this.http.get<ValidationRuleData[]>(this.apiUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });
  }

  createRule(rule: ValidationRuleData): Observable<ValidationRuleData> {
    return this.http.post<ValidationRuleData>(this.apiUrl, rule, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  updateRule(id: string, rule: Partial<ValidationRuleData>): Observable<ValidationRuleData> {
    return this.http.put<ValidationRuleData>(`${this.apiUrl}/${id}`, rule, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  deleteRule(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: {
        'Accept': 'application/json'
      }
    });
  }
}
