<script>
document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('contactForm');
  var confirmation = document.getElementById('confirmation-message');
  if(form && confirmation) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      form.style.display = 'none';
      confirmation.style.display = 'block';
      confirmation.scrollIntoView({behavior: 'smooth'});
    });
  }
});
</script>
