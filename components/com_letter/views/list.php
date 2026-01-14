<div class="col-sm-12 col-md-9"><!-- Start Left content -->

    <!-- start: patient_name -->
    <?php loadModule('patient_name'); ?>
    <!-- /patient_name-->

    <div class="row mb-3">
    <div class="col-sm-12">
        <a class="btn btn-primary pull-left"
           href="index.php?com=letter&amp;view=select_category&amp;patient_id=<?= urlencode((string)($patient_id ?? '')) ?>&amp;user_id=<?= urlencode((string)($user->ID ?? '')) ?>">
            New Letter
        </a>

        <a href="<?= htmlspecialchars($backLink ?? '#', ENT_QUOTES, 'UTF-8') ?>"
           class="btn btn-default pull-right">
            ← Back
        </a>

        <div style="clear: both;"></div>
    </div>
	</div>

    <div class="row">&nbsp;</div>

    <div class="row">
        <div class="box">
            <div class="box-header">
                <h2><i class="icon-reorder"></i><span class="break"></span>Letters</h2>
            </div>

            <div class="box-content">
                <table class="table">
                    <thead>
                        <tr>
                            <th>TimeStamp</th>
                            <th>Letter Name</th>
                            <th>Internal Note</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach (($letters ?? []) as $letter): ?>
                            <?php
                                $letterId   = (string)($letter->letter_id ?? '');
                                $timestamp  = (string)($letter->timestamp ?? '');
                                $name       = (string)($letter->name ?? '');
                                $note       = (string)($letter->note ?? '');
                                $patientPid = (string)($patient->patient_id ?? '');
                            ?>
                            <tr id="<?= htmlspecialchars($letterId, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?>">
                                <td><?= htmlspecialchars($timestamp, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?></td>
                                <td><?= htmlspecialchars($name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?></td>
                                <td><?= htmlspecialchars($note, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?></td>
                                <td>
                                    <a class="btn btn-success"
                                       href="index.php?com=letter&amp;view=edit_letter&amp;letter_id=<?= urlencode($letterId) ?>&amp;patient_id=<?= urlencode($patientPid) ?>">
                                        View
                                    </a>
                                    <a class="btn btn-danger delete_letter"
                                       data-letter-id="<?= htmlspecialchars($letterId, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?>"
                                       href="#">
                                        Delete
                                    </a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</div><!--/col /left content -->

<div class="col-md-3 visible-md visible-lg" id="feed"><!-- Start Right content -->
    <?php loadModule('patient_menu'); ?>
</div><!--/col /Right Content-->