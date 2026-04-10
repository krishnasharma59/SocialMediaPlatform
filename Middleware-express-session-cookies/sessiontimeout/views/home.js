<h2>Welcome User 👋</h2>

<p>Your session will expire soon.</p>

<div id="warning" style="display:none; color:red;">
  ⚠️ Your session is about to expire!
  <button onclick="extendSession()">Stay Logged In</button>
</div>

<script>
  // Show warning at 50 seconds
  setTimeout(() => {
    document.getElementById("warning").style.display = "block";
  }, 50000);

  // Auto logout after 60 seconds
  setTimeout(() => {
    alert("Session expired! Please refresh.");
    location.reload();
  }, 60000);

  function extendSession() {
    fetch("/extend-session")
      .then(res => res.text())
      .then(data => {
        alert(data);
        document.getElementById("warning").style.display = "none";
      });
  }
</script>