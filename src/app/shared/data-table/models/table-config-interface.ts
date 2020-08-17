import {TemplateRef} from '@angular/core';

export default interface TableConfigInterface {
  columns: { title: string, key: string, sortable?: boolean, cellTemplate?: TemplateRef<any> }[];
  pagination: {
    pageNumber: number,
    pageSize: number,
    pageSizeOptions?: number[],
  };
}
