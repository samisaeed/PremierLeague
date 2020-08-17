import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {DataTableService} from './services/data-table.service';
import TableConfigInterface from './models/table-config-interface';
import {Subject} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<TableConfigInterface>;
  displayedColumns: string[];
  matches = [];
  totalCount: 0;

  @Input() tableConfig: TableConfigInterface;

  private unsubscribeAll$: Subject<boolean> = new Subject<boolean>();

  constructor(private dataTableService: DataTableService) {
  }

  ngOnInit(): void {
    this.displayedColumns = this.tableConfig.columns.map(config => config.key);
    this.getTableData();
  }

  getTableData(): void {
    this.dataTableService.tableData
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe(res => {
        if ( !res) {
          return;
        }
        this.dataSource = res.data;
        this.totalCount = res.totalCount;

      });
  }

  onPageChange($event: PageEvent): void {
    this.dataTableService.onPageChange($event);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(true);
    this.unsubscribeAll$.complete();
  }

}
