var todoCtrl=$.mvc.controller.create('todo', {
        views: {"list_tpl":"views/list.tpl"}, /* Array of views to load */
        save:function(){
                value=$("#new-todo").val();
                $("#new-todo").val('');
                var that=this;
                var todo = new Todo();
                if(value.length==0)
                   return alert("Please enter some text");
                todo.text=value;
                
                todo.set({text:value});
                todo.save(function(){
                    var str="<li><input data-id='"+todo.id+"' class='check' type='checkbox' value='active' /><div class='todo-text' >"+todo.text+"</div> <span class='todo-destroy' style='display:none;'><input data-id='"+todo.id+"' type='button' class='handleArchive' value='archive' style='width: 90px;height: 43px;' /></span></li>";

                    $("#leftTodo ul").append($(str));
                    that.updateCounters();
                });
               

        },
        /* This function updates the number of todos on the screen */
        updateCounters:function(){
            var el=$("#leftTodo");
            total=el.find("li").length;
            el.find(".count").html(total++);

            var el=$("#completedTodo");
            total=el.find("li").length;
            el.find(".count").html(total++);

            var el=$("#archivedTodo");
            total=el.find("li").length;
            el.find(".count").html(total++);
        },
        default:function(){
            
            todo.getAll(function(all){
                var active=all.filter(function(obj){return obj.isComplete==false&&obj.isArchived==false});
                var completed=all.filter(function(obj){return obj.isComplete==true});
                var archived=all.filter(function(obj){return obj.isArchived==true});
                
                $("#leftTodo").html($.template('list_tpl',{title:'Active',listCSS:'active mainScreen',items:active,state:'active',checked:'',archiveText:'Archive'}));
                $("#completedTodo").html($.template('list_tpl',{title:'Completed',listCSS:'completed  mainScreen',items:completed,state:'complete',checked:'checked',archiveText:'Archive'}));
                $("#archivedTodo").html($.template('list_tpl',{title:'Archived',listCSS:'archived archiveScreen',items:archived,state:'archived',checked:'',archiveText:'Delete'}));
            });
        
        },
        /* This is executed when the controller is created.  It assumes the views are loaded, but can not interact with models 
         * This is useful for wiring up page events, etc.
        */
        init:function(){
            var self=this;
            var checkboxClick=function(evt){
                var that=this;
                var id=$(this).data("id");
                todo.get(id,function(el){
                    var $el=$(that).closest("li");
                    if(that.value=="active")
                    {
                        el.finishItem();
                        that.value="complete";
                        $("#completedTodo ul").append($el);
                        that.checked=true;
                     
                    }
                    else if(that.value=="complete")
                    {
                        el.resetItem();
                        that.value="active";
                        $("#leftTodo ul").append($el);
                        this.checked=false;
                    }
                    else {
                        el.finishItem();
                        that.value="complete"
                        $("#completedTodo ul").append($el);
                        that.checked=true;
                    }
                    $(that).parent().find("span input").val("Archive");
                    $(that).parent().find("span").hide();
                    self.updateCounters();
                });
            }


            $("#cancelButton").bind("click",function(e){
                $("#new-todo").val('');
            });
            
            $("#content").on("click","input[type='checkbox']",checkboxClick);
            $("#content").on("swipeLeft swipeRight","div.todo-text",function(e){
                $(this).closest("li").find("span").show();
            });

            $("#create-todo").on("click",".handleArchive",function(e){
                var el=$(this).closest("li");
                $(this.parentNode).hide();
                $("#archivedTodo ul").append(el);
                var item=el.find(".check");
                item.get().checked=true;
                var id=item.data("id");
                el.find("span input").val("Delete")
                todo.get(id,function(item){
                    item.archiveItem();
                    self.updateCounters();
                });
            });

            $("#archived").on("click",".handleArchive",function(e){
                var el=$(this).closest("li");
                var id=el.find(".check").data("id");
                todo.get(id,function(item){
                    item.remove();
                    el.remove();
                    self.updateCounters();
                });
             });        
        }
    }
);
  