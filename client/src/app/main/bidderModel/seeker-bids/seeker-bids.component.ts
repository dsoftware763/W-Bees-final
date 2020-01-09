import { Component, OnInit, ViewChild } from '@angular/core';
import { Feathers } from 'feather.service';


@Component({
  selector: 'app-seeker-pending-jobs',
  templateUrl: './seeker-bids.component.html',
  styleUrls: ['./seeker-bids.component.scss']
})
export class SeekerBidsComponent implements OnInit {
  displayedColumns: string[] = ['bid_on', 'job_id', 'price', 'status', 'description' ];
  dataSource = [];


  constructor(
      private feathers: Feathers
  ) { }

  ngOnInit(): void {
    this.getMyBids();
  }

  getMyBids = () => {
      this.feathers.find('bids', {createdBy : 1})
      .then(res => {
        this.dataSource = res;
      }, err => {
        console.log('response of my bids err', err);
      });
  }

}
