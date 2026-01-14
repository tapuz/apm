<script>
    const letter = <?= $letterJSON ?>;
    const clinicsJSON = <?= $clinicsJSON ?>;
    const patientName = <?= json_encode($patientName ?? '', JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?>;
    // const patientEmail = 'thierry@tapuz.be';
</script>

<div class="col-sm-12 col-md-9"><!-- Start Left content -->

    <!-- start: patient_name -->
    <?php loadModule('patient_name'); ?>
    <!-- /patient_name-->
	<div class="row">
		<div class="col-sm-12">
			<a href="<?= htmlspecialchars($backLink ?? '#', ENT_QUOTES, 'UTF-8') ?>"
			class="btn btn-default pull-right">
				← Back
			</a>
			<div style="clear: both;"></div>
		</div>
	</div>
    <div class="row">
        <label class="control-label" for="name">Letter name</label>
        <input
            type="text"
            class="form-control"
            name="name"
            id="name"
            placeholder="Enter letter name"
            value="<?= htmlspecialchars($letter->name ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?>"
        />

        <label class="control-label" for="note">Note</label>
        <input
            type="text"
            class="form-control"
            name="note"
            id="note"
            placeholder="Internal note"
            value="<?= htmlspecialchars($letter->note ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?>"
        />

        <label class="control-label" for="clinic">Clinic</label>
        <select class="form-control" id="clinic" name="clinic">
            <?php foreach (($clinics ?? []) as $clinic): ?>
                <?php
                    $clinicId = (string)($clinic->clinic_id ?? '');
                    $selected = ($clinicId !== '' && $clinicId === (string)($letter->clinic_id ?? '')) ? ' selected' : '';
                    $clinicName = (string)($clinic->clinic_name ?? '');
                ?>
                <option clinic_id="<?= htmlspecialchars($clinicId, ENT_QUOTES, 'UTF-8') ?>"
                        value="<?= htmlspecialchars($clinicId, ENT_QUOTES, 'UTF-8') ?>"<?= $selected ?>>
                    <?= htmlspecialchars($clinicName, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?>
                </option>
            <?php endforeach; ?>
        </select>
    </div>

    <div class="row">&nbsp;</div>

    <div class="row">
        <label class="control-label" for="email_address">Email address</label>
        <input
            type="text"
            class="form-control"
            name="email_address"
            id="email_address"
            placeholder="Email address"
            value="<?= htmlspecialchars($patientEmail ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?>"
        />
    </div>

    <div class="row">
        <label class="control-label" for="email_message">Email message</label>
        <textarea class="form-control" rows="3" name="email_message" id="email_message" placeholder="Email message"></textarea>
    </div>

    <div class="row">
        <div class="pull-right">
            <button type="button" class="btn btn-primary saveLetter">Save</button>
            <button type="button" class="btn btn-primary print">Print</button>
            <button type="button" class="btn btn-primary email">Email</button>
        </div>
    </div>

    <div class="row">
        <div id="editor-container">
            <div id="toolbar">
                <?php editorToolbar(); ?>
            </div>
            <div id="editor"></div>
        </div>
    </div><!--/row-->

</div><!--/col /left content -->

<div class="col-md-3 visible-md visible-lg" id="feed"><!-- Start Right content -->
    <h2>Templates</h2>
    <ul class="nav main-menu">
        <?php foreach (($templates ?? []) as $template): ?>
            <li>
                <a href="#"
                   class="load_template"
                   template_id="<?= htmlspecialchars((string)($template->id ?? ''), ENT_QUOTES, 'UTF-8') ?>">
                    <?= htmlspecialchars((string)($template->name ?? ''), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?>
                </a>
            </li>
        <?php endforeach; ?>
    </ul>
</div><!--/col /Right Content-->

<input type="hidden" id="letter_id" value="<?= htmlspecialchars((string)($letter_id ?? ''), ENT_QUOTES, 'UTF-8') ?>">
<input type="hidden" id="patient_id" value="<?= htmlspecialchars((string)($patient->patient_id ?? ''), ENT_QUOTES, 'UTF-8') ?>">
<input type="hidden" id="user_id" value="<?= htmlspecialchars((string)($user->ID ?? ''), ENT_QUOTES, 'UTF-8') ?>">
<input type="hidden" id="clinic_logo" value="<?= htmlspecialchars((string)($clinic->clinic_logo ?? ''), ENT_QUOTES, 'UTF-8') ?>">
<input type="hidden" id="clinic_letter_heading" value="<?= htmlspecialchars((string)($clinic->clinic_letter_heading ?? ''), ENT_QUOTES, 'UTF-8') ?>">

<script>
    // $('#editor').wysiwyg();
</script>