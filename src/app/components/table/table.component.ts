import { throttleTime } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation, viewChild, inject, effect, DestroyRef } from '@angular/core';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatNoDataRow, MatTableDataSource } from '@angular/material/table';

import { Ticker } from '@models/ticker';
import { DataStore } from '@store/data.store';
import { TABLE_COLUMNS } from '@constants/table-columns.const';
import { WebsocketService } from '@services/web-socket.service';
import { LoadingDirective } from '@directives/loading.directive';
import { FilterDlgComponent } from '@components/filter-dlg/filter-dlg.component';
import { PriceHistoryDlgComponent } from '@components/price-history-dlg/price-history-dlg.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatRow,
    MatSort,
    MatCell,
    MatIcon,
    MatTable,
    MatRowDef,
    MatCellDef,
    MatHeaderRow,
    MatColumnDef,
    MatNoDataRow,
    MatPaginator,
    MatIconButton,
    MatSortHeader,
    MatHeaderCell,
    MatHeaderRowDef,
    MatHeaderCellDef,
    LoadingDirective,
    MatMiniFabButton,
  ],
})
export class TableComponent implements OnInit {
  // DI
  public dataStore = inject(DataStore);
  public matDialog = inject(MatDialog);
  public destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private websocketService = inject(WebsocketService);

  // Table
  public displayedColumns = TABLE_COLUMNS;
  public dataSource: MatTableDataSource<Ticker>;

  private sort = viewChild(MatSort);

  constructor() {
    effect(() => this.dataStore.filteredData() && this.onResData(this.dataStore.filteredData()));
  }

  public ngOnInit(): void {
    this.dataStore.getData();
    this.subscribeOnGetTickerData();
  }

  // Data
  private onResData(data: Ticker[]): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort() ?? null;
    this.cdr.markForCheck();
  }

  private subscribeOnGetTickerData(): void {
    this.websocketService.getPriceData()
      .pipe(
        throttleTime(10000),
        takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        this.dataStore.updateTickersPrice(data);
        this.cdr.markForCheck();
      });
  }

  // Filter
  public openFilterDlg(): void {
    this.matDialog.open(FilterDlgComponent, {
      autoFocus: false,
      data: {},
    })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
  }

  public clearFilter(): void {
    this.dataStore.clearFilterData();
  }

  // History dialog
  public get24hPriceHistory(symbol: string): void {
    this.matDialog.open(PriceHistoryDlgComponent, {
      autoFocus: false,
      width: '500px',
      data: {
        symbol,
      },
    })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
  }
}
