import { Component, OnInit } from '@angular/core';
import { NewsService } from 'src/app/Services/News/news.service';
import { News } from 'src/app/Models/Maintenance/Response/news';
import * as moment from 'moment';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  public dataSource : News[] = [];
  displayedColumns: string[] = ['story_url', 'created_at',"action"];
  constructor(private newsService:NewsService) {

    this.GetNews();
   }

  ngOnInit() {

  }

  GetNews(){
    this.newsService.Get().subscribe((data:News[])=>{
      this.dataSource =this.ClearData(data);
    });
  }

  setFormatTitle(row:News){
    if(row.story_title == null){
      if(row.title !== null){
        return row.title
      }
    }
    return row.story_title;
  }

  SetFormatDate(badDate:string){
    return moment(badDate).subtract(1, 'days').calendar();
  }

  ClearData(data:News[]){
    let aceptedData:News[]=[]
    data.forEach(newElement => {
      if(newElement.story_title == null){
        if(newElement.title !== null){
          aceptedData.push(newElement);
        }
      }else{
        aceptedData.push(newElement);
      }   
    });
    return aceptedData;
  }

  DeleteRowData(row_obj){
    this.newsService.Delete(row_obj.story_id).
      subscribe(
        result => console.log(result)
      );
    this.dataSource = this.dataSource.filter((value)=>{
      return value.story_id != row_obj.story_id;
    });
  }
}
