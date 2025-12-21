<?php
/**
 * Edit Invoice
 */
?>

<script>
var pageTitle = <?= json_encode($pageTitle ?? '', JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?>;
</script>

<input type="hidden" id="invoice_id" value="<?= htmlspecialchars((string)($invoice->invoice_id ?? ''), ENT_QUOTES, 'UTF-8') ?>">
<input type="hidden" id="invoice_heading" value="<?= htmlspecialchars((string)($invoice_heading->clinic_invoice_heading ?? ''), ENT_QUOTES, 'UTF-8') ?>">

<div class="col-md-1"></div>
<div class="col-sm-12 col-md-9" id="invoice"><!-- Start Left content -->

  <div class="row"></div>

  <div class="row">
    <div class="box" id="">
      <div class="box-header hidden-print">
        <h2><i class="icon-edit"></i>Invoice for: <?= htmlspecialchars((string)($patientName ?? ''), ENT_QUOTES, 'UTF-8') ?></h2>
      </div>

      <div class="box-content">
        <div class="row">

          <div class="input-group col-sm-3">
            <label for="date">Datum:</label>
            <input
              type="text"
              class="form-control date-picker"
              id="date"
              data-date-format="dd/mm/yyyy"
              value="<?= htmlspecialchars(($invoice_date instanceof DateTimeInterface) ? $invoice_date->format('d-m-Y') : '', ENT_QUOTES, 'UTF-8') ?>"
            />

            <label class="control-label" for="note">Note</label>
            <input
              type="text"
              class="form-control invoiceField"
              name="note"
              id="note"
              placeholder="Invoice note"
              value="<?= htmlspecialchars((string)($invoice->note ?? ''), ENT_QUOTES, 'UTF-8') ?>"
            />
          </div>

          <div class="col-sm-6 print_width_30">
            <label for="invoice_address">Ontvangen van:</label>
            <div class="well" contenteditable="true" id="invoice_address" rows="5">
              <?= $invoice->address ?>
            </div>
          </div>

          <div class="col-sm-2 pull-right">
            <div class="row">
              <button onclick="printInvoice();" type="button" class="btn btn-primary">Print</button>
              <button type="button" class="btn btn-primary close_window">Close</button>
            </div>
          </div>

        </div>

        <div class="hidden-print">&nbsp;</div>
        <div class="hidden-print">&nbsp;</div>

        <div class="row">
          <div class="col-md-6">
            <div class="box">
              <div class="box-header hidden-print">
                <h2><i class="icon-edit"></i>Invoice Items</h2>
              </div>

              <div class="box-content">
                <table class="table" id="invoice_items">
                  <thead>
                    <tr>
                      <th class="col-sm-5 print_width_50">Item</th>
                      <th class="col-sm-3 print_width_30">Honorarium</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colspan="2" class="sum_invoice hidden-print">
                        <div>Totaal:</div> <div id="sum_invoice"></div>
                      </td>
                    </tr>

                    <?php foreach (($invoice_items ?? []) as $invoice_item): ?>
                      <tr id="<?= htmlspecialchars((string)($invoice_item->invoice_item_id ?? ''), ENT_QUOTES, 'UTF-8') ?>">
                        <td><?= htmlspecialchars((string)($invoice_item->item_description ?? ''), ENT_QUOTES, 'UTF-8') ?></td>
                        <td>
                          <div class="input-prepend input-group">
                            <span class="input-group-addon">€</span>
                            <input
                              class="form-control item_price"
                              size="16"
                              type="text"
                              value="<?= htmlspecialchars((string)($invoice_item->item_price ?? ''), ENT_QUOTES, 'UTF-8') ?>"
                            >
                          </div>
                        </td>
                        <td>
                          <a
                            class="btn btn-danger delete_invoice_item glyphicon glyphicon-remove"
                            invoice_item_id="<?= htmlspecialchars((string)($invoice_item->invoice_item_id ?? ''), ENT_QUOTES, 'UTF-8') ?>"
                            payment_id="<?= htmlspecialchars((string)($invoice_item->payment_id ?? ''), ENT_QUOTES, 'UTF-8') ?>"
                          ></a>
                        </td>
                      </tr>
                    <?php endforeach; ?>

                    <tr>
                      <td class="visible-print text-right"><strong>Totaal: €</strong></td>
                      <td class="visible-print"><strong><span id="sum_invoice_print"></span></strong></td>
                      <td>&nbsp;</td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>
          </div><!--/col -->

          <div class="col-md-6 noprint">
            <div class="box">
              <div class="box-header">
                <h2><i class="icon-reorder"></i><span class="break"></span>Consultations</h2>
              </div>
              <div class="box-content">
                <table class="table" id="payments">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <?php foreach (($payments ?? []) as $payment): ?>
                      <tr id="payment_<?= htmlspecialchars((string)($payment->payment_id ?? ''), ENT_QUOTES, 'UTF-8') ?>">
                        <td><?= htmlspecialchars((string)getDateFromTimestamp($payment->payment_date ?? null), ENT_QUOTES, 'UTF-8') ?></td>
                        <td><?= htmlspecialchars((string)($payment->amount ?? ''), ENT_QUOTES, 'UTF-8') ?></td>
                        <td>
                          <a
                            class="btn btn-primary add_payment_to_invoice"
                            payment_id="<?= htmlspecialchars((string)($payment->payment_id ?? ''), ENT_QUOTES, 'UTF-8') ?>"
                            amount="<?= htmlspecialchars((string)($payment->amount ?? ''), ENT_QUOTES, 'UTF-8') ?>"
                            payment_date="<?= htmlspecialchars((string)getDateFromTimestamp($payment->payment_date ?? null), ENT_QUOTES, 'UTF-8') ?>"
                          >Add</a>
                        </td>
                      </tr>
                    <?php endforeach; ?>
                  </tbody>
                </table>
              </div><!--/box-content -->
            </div><!--/box -->
          </div><!--/col -->

        </div><!--/row -->

      </div><!--/box-content -->
    </div><!--/box -->
  </div><!--/row -->

  <div class="row visible-print">
    <?= $signature ?? '' ?>
  </div>
  <div class="row visible-print">
    <?= htmlspecialchars((string)($practitioner_name ?? ''), ENT_QUOTES, 'UTF-8') ?>
  </div>

</div><!--/col /left content -->

<div class="col-md-2"></div>