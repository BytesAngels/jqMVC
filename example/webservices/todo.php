<?php
/**
 * This is a basic example to show how to interact with a backend web service with jqMVC.  This is not intended to be production code, as there are numerous security holes.
 */
    class todo {
       public $isComplete=false;
       public $isArchived=false;
       public $text='';
       public $id=0;
       
       function bind($arr){
        
            if(isset($arr->isComplete))
                $this->isComplete=$arr->isComplete;
            
            if(isset($arr->isArchived))
                $this->isArchived=$arr->isArchived;
                
            if(isset($arr->text))
                $this->text=$arr->text;
            if(isset($arr->id))
                $this->id=$arr->id;
       }
       function bindArr($arr){
            if(isset($arr['isComplete']))
                $this->isComplete=$arr['isComplete'];
            
            if(isset($arr['isArchived']))
                $this->isArchived=$arr['isArchived'];
                
            if(isset($arr['text']))
                $this->text=$arr['text'];
            if(isset($arr['id']))
                $this->id=$arr['id'];
       }
    }
    
    $axt=isset($_GET['axt'])?strtolower($_GET['axt']):null;
    $data=isset($_GET['data'])?json_decode($_GET['data']):null;
    
    $td = new todo();
    $td->bind($data);
    if(!$axt)
       return;
    if ($db = new PDO('sqlite:todo.sqlite')) {
        if($axt=="save")
        {
            if(isset($data->id)&&strlen($data->id)>0)
            {
                $res=$db->prepare("UPDATE todo SET isComplete=? , isArchived=?, user_text=? where id=?");
                $myData=array((int)$td->isComplete,(int)$td->isArchived,$td->text,$td->id);
                
                $res->execute($myData);
                echo "1";
            }
            else {
               $res=$db->prepare("INSERT into todo (isComplete, isArchived,user_text) values (0,0,?)");
               $res->execute(array($td->text));
               echo $db->lastInsertId();
            }
        }
        if($axt=="get")
        {
            $row=$db->query("SELECT * FROM todo where id='".(int)$_GET['data']."'")->fetch();
            $res=new todo();
            if(count($row)>0){
            $res->bindArr($row);
            $res->text=$row['user_text'];
            }
            echo json_encode($res);
        }
        if($axt=="getall")
        {
            $retArr=Array();
            foreach ($db->query("SELECT * FROM todo") as $entry) {
                $res=new todo();
                $res->bindArr($entry);
                $res->text=$entry['user_text'];
                $retArr[]=$res;
            }
            
            echo json_encode($retArr);
        }
        if($axt=="delete")
        {
            
            
            $db->query("DELETE FROM todo where id=".(int)$_GET['data']);
            
            echo "1";
        }
    }
?>