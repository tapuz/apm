<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js" integrity="sha384-NaWTHo/8YCBYJ59830LTz/P4aQZK1sS0SneOgAvhsIl3zBu8r9RevNg5lHCHAuQ/" crossorigin="anonymous"></script>


<script>
    var doc = new jsPDF()

    doc.text('Hello world!', 10, 10)
    //doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank')
    //doc.save('a4.pdf')
</script>

<?php


?>