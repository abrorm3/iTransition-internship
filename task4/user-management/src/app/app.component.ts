import { Component } from '@angular/core';
import { DataService } from './shared/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'user-management';
  backendData:any;
  constructor(private dataService: DataService) { }

  action(){
    this.dataService.getData().subscribe(data=>{
      this.backendData = data;
    })
    console.log("Retrieved!")
    console.log(this.backendData)
  }
}
