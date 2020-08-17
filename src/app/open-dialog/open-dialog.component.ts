import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-open-dialog',
  templateUrl: './open-dialog.component.html',
  styleUrls: ['./open-dialog.component.css']
})
export class OpenDialogComponent implements OnInit {
  results;
  constructor( public dialogRef: MatDialogRef<OpenDialogComponent>,
               @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    if (this.data) {
      this.results = this.data.results;
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
