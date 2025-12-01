import { Injectable } from '@angular/core';
import { Database, ref, get } from '@angular/fire/database';
import { Observable, from, map, catchError, of } from 'rxjs';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private database: Database) { }

  getCategories(): Observable<Category[]> {
    const categoriesRef = ref(this.database, 'categories');
    return from(get(categoriesRef)).pipe(
      map(snapshot => {
        console.log('Categories snapshot exists:', snapshot.exists());
        console.log('Categories snapshot val:', snapshot.val());
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log('Data keys:', Object.keys(data));
          const categories = Object.keys(data).map(key => {
            console.log(`Processing key: ${key}, value:`, data[key]);
            return {
              key: key,
              name: data[key].name || data[key]  // Fallback if no name property
            };
          });
          console.log('Final mapped categories:', categories);
          return categories;
        } else {
          console.log('No categories found in DB');
          return [];
        }
      }),
      catchError(error => {
        console.error('Error fetching categories:', error);
        return of([]);
      })
    );
  }
}
