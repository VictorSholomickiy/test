import { finalize } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import { MatCard } from '@angular/material/card';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectionStrategy, Component, DestroyRef, Inject, inject, signal, ViewEncapsulation } from '@angular/core';

import { DataStore } from '@store/data.store';
import { DataService } from '@services/data.service';
import { LoadingDirective } from '@directives/loading.directive';
import { CandlestickData, CandlestickResponse } from '@models/chart-data';
import { ModalHeaderComponent } from '@sh-components/modal-header/modal-header.component';

@Component({
  selector: 'price-history-dlg',
  templateUrl: './price-history-dlg.component.html',
  styleUrl: './price-history-dlg.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCard,
    LoadingDirective,
    BaseChartDirective,
    ModalHeaderComponent,
  ],
})
export class PriceHistoryDlgComponent {
  // DI
  public dataStore = inject(DataStore);
  public dialogRef = inject(MatDialogRef<PriceHistoryDlgComponent>);
  private destroyRef = inject(DestroyRef);
  private dataService = inject(DataService);

  // Chart
  public lineChartLabels = signal<string[]>([]);
  public lineChartLegend = signal<boolean>(true);
  public lineChartOptions = signal<any>({ responsive: true });
  public priceData = signal<{price: string, time: Date}[]>([]);
  public lineChartData = signal<{ data: string[], label: string, borderColor: string, backgroundColor: string, fill: boolean}[]>([]);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      symbol: string,
    },
  ) {
    Chart.register(...registerables);
    if (this.data.symbol) {
      this.fetchPriceHistory();
      this.dataStore.isHistoryLoading();
    }
  }

  private fetchPriceHistory(): void {
    this.dataService.get24hPriceHistory$(this.data.symbol)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(this.dataStore.isHistoryLoaded)
      )
      .subscribe((data: CandlestickResponse) => this.onFetchPriceHistory(data));
  }

  private onFetchPriceHistory(data: CandlestickResponse): void {
    this.priceData.set(data.map((d: CandlestickData) => ({price: d[4], time: new Date(d[0])})));
    this.lineChartData.set([{
      data: this.priceData().map(d => d.price),
      label: this.data.symbol,
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
    }]);
    this.lineChartLabels.set(this.priceData().map(d => d.time.toLocaleTimeString()));
  }
}
