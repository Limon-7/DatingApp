import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-values',
  templateUrl: './values.component.html',
  styleUrls: ['./values.component.css']
})
export class ValuesComponent implements OnInit {

  url = 'http://localhost:5000/values';
  values: any;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getValues();
  }
  getValues() {
    this.http.get(this.url).subscribe(response => {
      this.values = response;
    }, error => {
      console.log(error);
    });
  }
}
