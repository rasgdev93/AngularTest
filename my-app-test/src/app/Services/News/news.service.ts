import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { News } from 'src/app/Models/Maintenance/Response/news';
import { getHeaders } from 'src/environments/http-utils';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http: HttpClient) { }


  Get(){
    return this.http.get<News[]>("http://localhost:3000/news");
  }

  Delete(id: string){
      let params = { id: id };  
      return this.http.post<any>("http://localhost:3000/delete", params , { headers: getHeaders()});
    }
  }
