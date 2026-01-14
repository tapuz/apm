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

	<div class="row">&nbsp;</div>


    <div class="row">
        <div class="list-group">
            <a href="#" class="list-group-item active">Select Category</a>

            <?php foreach (($categories ?? []) as $category): ?>
                <?php
                    $categoryId = (string)($category->category_id ?? '');
                    $categoryName = (string)($category->name ?? '');
                    $patientId = (string)($patient->patient_id ?? '');
                    $userId = (string)($user->ID ?? '');
                ?>

                <a class="list-group-item"
                   href="index.php?com=letter&amp;view=edit_letter&amp;task=create_new_letter&amp;category_id=<?= urlencode($categoryId) ?>&amp;patient_id=<?= urlencode($patientId) ?>&amp;user_id=<?= urlencode($userId) ?>">
                    <?= htmlspecialchars($categoryName, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?>
                </a>
            <?php endforeach; ?>

        </div>
    </div><!--/row-->

</div><!--/col /left content -->

</div><!--/row-->