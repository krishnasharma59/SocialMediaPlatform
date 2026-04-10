<h1><%= data.title %></h1>
<p><%= data.message %></p>

<form action="/change-language" method="POST">
  <select name="language">
    <option value="en">English</option>
    <option value="hi">Hindi</option>
  </select>
  <button type="submit"><%= data.button %></button>
</form>