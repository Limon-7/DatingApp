import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  registerMode = false;
  values: any = {};
  url = 'http://localhost:5000/values';
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getValues();
  }
  registerToggle() {
    this.registerMode = true;
  }
  cancelRegister(registerMode: boolean) {
    this.registerMode = false;
  }
  getValues() {
    this.http.get(this.url).subscribe(response => {
      this.values = response;
    }, error => {
      console.log(error);
    });
  }

}
