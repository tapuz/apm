<?php
class Invoice {

    public $invoice_id;
    public $address;
    public $patient_id;
    public $date;
    public $clinic_id;

    public $invoice_item_id;
    public $item_description;
    public $item_price;
    public $payment_id;

    public static function getInvoice($invoice_id) {
        global $wpdb;
        $sql = $wpdb->prepare(
            'SELECT * FROM table_invoices WHERE invoice_id = %d',
            $invoice_id
        );
        return $wpdb->get_row($sql);
    }

    // ✅ MUST be non-static (uses $this)
    public function insertInvoice() {
        global $wpdb;

        $wpdb->insert(
            'table_invoices',
            array(
                'patient_id' => $this->patient_id,
                'clinic_id'  => $this->clinic_id,
                'date'       => date('Ymd'),
                'address'    => $this->address,
            ),
            array('%d', '%d', '%s', '%s')
        );

        $this->invoice_id = (int) $wpdb->insert_id;
        return $this->invoice_id;
    }

    public static function getInvoices($patient_id) {
        global $wpdb;
        $sql = $wpdb->prepare(
            'SELECT * FROM table_invoices WHERE patient_id = %d ORDER BY invoice_id DESC',
            $patient_id
        );
        return $wpdb->get_results($sql);
    }

    public static function deleteInvoice($invoice_id) {
        global $wpdb;
        return $wpdb->delete(
            'table_invoices',
            array('invoice_id' => $invoice_id),
            array('%d')
        );
    }

    // ✅ MUST be non-static (uses $this)
    public function addInvoiceItem() {
        global $wpdb;

        $wpdb->insert(
            'table_invoice_items',
            array(
                'invoice_id'       => $this->invoice_id,
                'item_description' => $this->item_description,
                'item_price'       => $this->item_price,
                'payment_id'       => $this->payment_id,
            ),
            array('%d', '%s', '%s', '%d')
        );

        $this->invoice_item_id = (int) $wpdb->insert_id;
        return $this->invoice_item_id;
    }

    public static function updateInvoiceTotal($invoice_id, $total) {
        global $wpdb;
        return $wpdb->update(
            'table_invoices',
            array('total' => $total),
            array('invoice_id' => $invoice_id),
            array('%s'),
            array('%d')
        );
    }

    public static function getInvoiceItems($invoice_id) {
        global $wpdb;
        $sql = $wpdb->prepare(
            'SELECT * FROM table_invoice_items WHERE invoice_id = %d',
            $invoice_id
        );
        return $wpdb->get_results($sql);
    }

    public static function deleteInvoiceItem($invoice_item_id) {
        global $wpdb;
        return $wpdb->delete(
            'table_invoice_items',
            array('invoice_item_id' => $invoice_item_id),
            array('%d')
        );
    }

    public static function getInvoiceHeading($clinic_id) {
        global $wpdb;
        $sql = $wpdb->prepare(
            'SELECT clinic_invoice_heading FROM table_clinics WHERE clinic_id = %d',
            $clinic_id
        );
        return $wpdb->get_row($sql);
    }

    public static function saveInvoice($id, $note) {
        global $wpdb;
        return $wpdb->update(
            'table_invoices',
            array('note' => $note),
            array('invoice_id' => $id),
            array('%s'),
            array('%d')
        );
    }
}
?>