$.ui.controller.create('todo', {
    save:function(){
            value=$("#new-todo").val();
            $("#new-todo").val('');
            var todo = new Todo();
            if(value.length==0)
               return alert("Please enter some text");
            todo.text=value;
            
            todo.set({text:value});
            todo.save();
            var str="<li><input data-id='"+todo.id+"' class='check' type='checkbox' value='active' /><div class='todo-text' >"+todo.text+"</div> <span class='todo-destroy' style='display:none;'><input data-id='"+todo.id+"' type='button' class='handleArchive' value='archive' style='width: 90px;height: 43px;' /></span></li>";

           $("#leftTodo ul").append($(str));
           updateCounters();
    },
    views: ["views/list.tpl"]
});


