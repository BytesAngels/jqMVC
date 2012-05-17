<div style="margin-top:25px; text-align:center; font-size:20px;">
   <%=title%> Todos (&nbsp;<span class='count'><%=items.length%></span>&nbsp;) - swipe to archive
</div>
<ul id="todo-list" class="<%=listCSS%>">
    <% for(var i=0;i<items.length;i++){
    %>
     <li>
        <input data-id='<%=items[i].id%>' class="check" type="checkbox" value='<%=state%>' <%=checked%> />
        <div class="todo-text" ><%=items[i].text%></div>
        <span class="todo-destroy" style="display:none;">
            <input data-id='<%=items[i].id%>' type="button" class='handleArchive' value="<%=archiveText%>" style="width: 90px;height: 43px;" />
        </span>
    </li>
    <%}%>
</ul>