import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatError } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
import { ChangeDetectionStrategy, Component, Inject, inject, OnInit, ViewEncapsulation } from '@angular/core';

import { DataStore } from '@store/data.store';
import { FilterForm } from '@constants/filter-form.const';
import { ModalHeaderComponent } from '@sh-components/modal-header/modal-header.component';

@Component({
  selector: 'filer-dlg',
  templateUrl: './filter-dlg.component.html',
  styleUrl: './filter-dlg.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatIcon,
    MatError,
    MatInput,
    AsyncPipe,
    MatSelect,
    MatOption,
    MatButton,
    MatFormField,
    MatIconButton,
    MatAutocomplete,
    ReactiveFormsModule,
    ModalHeaderComponent,
    MatAutocompleteTrigger,
  ],
})
export class FilterDlgComponent implements OnInit {
  // DI
  private dataStore = inject(DataStore);
  private formBuilder = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<FilterDlgComponent>);

  // Form
  public form: FormGroup;
  public FormFields = FilterForm;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {},
  ) {
    this.initForm();
  }

  public ngOnInit(): void {
    if (this.dataStore.filter()) {
      this.setFormValues();
    }
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    this.dataStore.updateFilterData(this.form.value);
    this.dialogRef.close(this.form.valid);
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      [FilterForm.VolumeMin]: [null],
      [FilterForm.VolumeMax]: [null],
      [FilterForm.PriceRangeMin]: [null],
      [FilterForm.PriceRangeMax]: [null],
      [FilterForm.PriceChangePercentageMin]: [null],
      [FilterForm.PriceChangePercentageMax]: [null],
    });
  }

  private setFormValues(): void {
    const filter = this.dataStore.filter();

    this.form.setValue({
      [FilterForm.VolumeMin]: filter.volumeMin,
      [FilterForm.VolumeMax]: filter.volumeMax,
      [FilterForm.PriceRangeMin]: filter.priceRangeMin,
      [FilterForm.PriceRangeMax]: filter.priceRangeMax,
      [FilterForm.PriceChangePercentageMin]: filter.priceChangePercentageMin,
      [FilterForm.PriceChangePercentageMax]: filter.priceChangePercentageMax,
    });
  }
}
