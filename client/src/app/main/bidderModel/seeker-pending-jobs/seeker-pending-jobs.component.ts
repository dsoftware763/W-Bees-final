import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
    position: number;
    name: string;
    status: string;
  }

const ELEMENT_DATA: PeriodicElement[] = [
    {position: 1, name: 'Hydrogen', status: 'H'},
    {position: 2, name: 'Helium', status: 'He'},
    {position: 3, name: 'Lithium', status: 'Li'},
    {position: 4, name: 'Beryllium', status: 'Be'},
    {position: 5, name: 'Boron', status: 'B'},
    {position: 6, name: 'Carbon', status: 'C'},
    {position: 7, name: 'Nitrogen', status: 'N'},
    {position: 8, name: 'Oxygen', status: 'O'},
    {position: 9, name: 'Fluorine', status: 'F'},
    {position: 10, name: 'Neon', status: 'Ne'},
  ];

@Component({
  selector: 'app-seeker-pending-jobs',
  templateUrl: './seeker-pending-jobs.component.html',
  styleUrls: ['./seeker-pending-jobs.component.scss']
})
export class SeekerPendingJobsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'status'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit(): void {
  }

}
