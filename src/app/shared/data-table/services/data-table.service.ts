import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {PageEvent} from '@angular/material/paginator';

@Injectable({
  providedIn: 'root'
})
export class DataTableService {
  private onTableDataChange: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  tableChangeEvent: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private page: any;
  constructor(private  http: HttpClient) {
  }


  setTableData({data, totalCount}): void {
    this.onTableDataChange.next({data, totalCount});
  }

  get tableData(): Observable<any> {
    return this.onTableDataChange as Observable<any>;
  }

  onPageChange($event: PageEvent): void {
    this.page = {pageNumber: $event.pageIndex , pageSize: $event.pageSize};
    this.tableChangeEvent.next({page: this.page});
  }



  getTableData(): Observable<any> {
    return this.http.get(`https://raw.githubusercontent.com/openfootball/football.json/master/2015-16/en.1.json`);
  }
}
