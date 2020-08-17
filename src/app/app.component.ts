import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DataTableService} from './shared/data-table/services/data-table.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import TableConfigInterface from './shared/data-table/models/table-config-interface';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {OpenDialogComponent} from './open-dialog/open-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'PremierLeague';
  tableConfig: TableConfigInterface;
  matches = [];
  totalMatches = [];
  totalPlayedMatches = [];
  totalDraw = [];
  totalWinMatches = [];
  totalLosMatches = [];
  private unsubscribeAll$: Subject<boolean> = new Subject<boolean>();
  @ViewChild('teamsTemplate', {static: true}) teamsTemplate: TemplateRef<any>;
  @ViewChild('scoreTemplate', {static: true}) scoreTemplate: TemplateRef<any>;

  constructor(private premierLeagueDataService: DataTableService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.tableConfig = {
      columns: [
        {
          title: 'Date',
          key: 'date',
        },
        {
          title: 'Teams',
          key: 'team1',
          cellTemplate: this.teamsTemplate,
        },
        {
          title: 'Score',
          key: 'score',
          cellTemplate: this.scoreTemplate,
        },
      ],
      pagination: {
        pageNumber: 0,
        pageSize: 10,
        pageSizeOptions: [10, 20]
      }
    };
    this.getPremierLeagueData();
    this.premierLeagueDataService.tableChangeEvent.subscribe(reloadEvent => {
      if (reloadEvent) {
        const pagination = {
          pageSize: reloadEvent ? reloadEvent.page.pageSize : 10,
          pageNumber: reloadEvent ? reloadEvent.page.pageNumber : 0
        };
        const formatValue = this.matches.slice(10 * pagination.pageNumber, (10 * pagination.pageNumber) + pagination.pageSize);
        this.premierLeagueDataService.setTableData({data: formatValue, totalCount: this.matches.length});
      }
    });
  }

  getPremierLeagueData(): void {
    this.premierLeagueDataService.getTableData()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe(response => {
        response.rounds.map(value => {
          value.matches.map(result => {
            this.matches.push(result);
            this.totalMatches.push(result);
          });
        });
        const formatValue = this.matches.slice(0, 10);
        this.premierLeagueDataService.setTableData({data: formatValue, totalCount: this.matches.length});
      });
  }

  // on click team name
  onClick(teamName): void {
    this.totalMatches.map(matches => {
      if (matches.team1 === teamName || matches.team2 === teamName) {
        this.totalPlayedMatches.push(teamName);
        if (matches.score.ft[0] === matches.score.ft[1]) {
          this.totalDraw.push(teamName);
        }
      }
    });
    this.totalWin(teamName);
    const teamResult = {
      teamFullName: teamName,
      totalPlayed: this.totalPlayedMatches.length,
      totalWin: this.totalWinMatches.length,
      totalLos: this.totalLosMatches.length,
      totalDraw: this.totalDraw.length,
    };
    this.openDialog(teamResult);
  }

  totalWin(teamName): void {
    this.totalMatches.map(matches => {
      if (matches.team1 === teamName) {
        if (matches.score.ft[0] > matches.score.ft[1]) {
          this.totalWinMatches.push(teamName);
        } else if (matches.score.ft[0] < matches.score.ft[1]) {
          this.totalLosMatches.push(teamName);
        }
      } else if (matches.team2 === teamName) {
        if (matches.score.ft[0] < matches.score.ft[1]) {
          this.totalWinMatches.push(teamName);
        } else if (matches.score.ft[0] > matches.score.ft[1]) {
          this.totalLosMatches.push(teamName);
        }
      }
    });
  }

  openDialog(team): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.data = {results: team};
    const dialogRef = this.dialog.open(OpenDialogComponent, dialogConfig);

    // dialogRef.afterClosed().subscribe(data => {
    //   if (data) {
    //   }
    // });
  }


  ngOnDestroy(): void {
    this.unsubscribeAll$.next(true);
    this.unsubscribeAll$.complete();
  }

}
