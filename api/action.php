<?php 
header("Content-type:application/json");

require_once('initial.php');

function getActivityMaster($keyword){

    global $conn;

    $sql = "SELECT * 
        FROM ActivityMaster 
        WHERE activity_name LIKE '%{$keyword}%'
        ORDER BY activity_name limit 10";
    
    $result = $conn->query($sql);
    
    $result_arr = array();
    while ($row = $result->fetch_assoc()) {
        $arr = array('ID'=>$row['ID'],"activity_name"=>$row['activity_name']);
        array_push($result_arr,$arr);
    }

    echo json_encode($result_arr);
    $result->free();
    mysqli_close($conn);

}

function updateContinueActivityList($date,$tabID,$token){

    global $conn;

    $userID = getUserIDByToken($token);

    $sql = "SELECT AL.Activity,MAX(AL.activity_days) as max_days 
    FROM ActivityList AL
    WHERE AL.Activity in 
    (
        SELECT Activity 
        FROM ActivityList 
        WHERE Activity_Date = '{$date}' 
        AND is_continue = 1 
        AND UserID = {$userID}
    ) 
    AND AL.is_complete = 1 
    AND (
            AL.Activity_Date >=
            (
                CASE WHEN 
                ( 
                    SELECT 1 
                    FROM UserAction 
                    WHERE user = {$userID} 
                    AND object = AL.Activity 
                    AND action_date <= '{$date}'
                    AND action = 'Reset Continue Activity' LIMIT 1
                ) = 1 
                THEN 
                (
                    SELECT MAX(action_date) 
                    FROM UserAction 
                    WHERE user = {$userID} 
                    AND object = AL.Activity 
                    AND action_date < '{$date}'
                    AND action = 'Reset Continue Activity'
                )
                ELSE 
                (
                    SELECT MIN(Activity_Date) 
                    FROM ActivityList 
                    WHERE UserID = {$userID} 
                    AND Activity_Date < '{$date}'
                    AND Activity = AL.Activity
                )
                END 
            ) AND AL.Activity_Date < '{$date}'
        ) 
    AND tabID = {$tabID} 
    AND UserID = {$userID}
    GROUP BY Activity";

    $result = $conn->query($sql);

    while ($row = $result->fetch_assoc()) {
        $maxdays = $row['max_days']+1;
        $activity = $row['Activity'];
        $sql = "UPDATE ActivityList SET activity_days = {$maxdays}
        WHERE Activity_Date = '{$date}' AND Activity = '{$activity}' 
        AND tabID = {$tabID} AND UserID = {$userID}";
        $result2 = $conn->query($sql);

    }

    $sql = "UPDATE ActivityList SET activity_days = 1 WHERE 
    Activity NOT IN 
    (
        SELECT Activity FROM (
        SELECT Activity FROM ActivityList 
        WHERE Activity in 
        (
            SELECT Activity FROM ActivityList 
            WHERE Activity_Date = '{$date}' AND is_continue = 1 
            AND tabID = {$tabID} AND UserID = {$userID}
        ) 
        AND is_complete = 1 and Activity_Date != '{$date}' AND tabID = {$tabID} 
        AND UserID = {$userID}
        GROUP BY Activity
    ) as total
    ) and Activity_Date = '{$date}' and is_continue = 1 AND tabID = {$tabID} 
    AND UserID = {$userID}";


    $result3 = $conn->query($sql);

}

function getActivityList($token){

    global $conn;

    $userID = getUserIDByToken($token);
    
    if($userID){

        if(isset($_POST['tabID'])){
            $tabID = $_POST['tabID'];
            //get Tab type 
            $sql = "SELECT type FROM `TabListMaster` WHERE ID = {$tabID}";
            $result = $conn->query($sql);
            $tabType=0;
            while ($row = $result->fetch_assoc()) {
                $tabType = $row['type'];
            }
            
            if($tabType == 1){
                if(isset($_POST['date'])){
                    $date = $_POST['date'];
                    $tabID = $_POST['tabID'];
                    updateContinueActivityList($date,$tabID,$token);
                    //get List from daily tab type
                    $sql = "SELECT AL.*,
                    (
                        CASE WHEN is_continue THEN CONCAT(activity_name,' #',activity_days)
                        ELSE activity_name END
                    ) as activity_name,
                    (
                        SELECT COUNT(*) FROM ActivityList WHERE parentList = AL.ID 
                        AND Activity_Date = '{$_POST['date']}' and tabID={$tabID}
                        and UserID = {$userID}
                    ) as amountSubList
                    FROM `ActivityList` AL
                    INNER JOIN `ActivityMaster` AM
                    ON AL.Activity = AM.ID
                    WHERE Activity_Date = '{$_POST['date']}' and tabID={$tabID} 
                    and UserID = {$userID} and AL.parentList = 0
                    ORDER BY is_complete,ID";

                }else{
                    //get List from none-daily tab type
                    $tabID = $_POST['tabID'];
                    updateContinueActivityList(date("Y-m-d"),$tabID,$token);
                    $sql = "SELECT AL.*, activity_name,
                    (
                        SELECT COUNT(*) FROM ActivityList WHERE parentList = AL.ID 
                        AND tabID={$tabID} and UserID = {$userID}
                    ) as amountSubList
                    FROM `ActivityList` AL
                    INNER JOIN `ActivityMaster` AM
                    ON AL.Activity = AM.ID
                    WHERE tabID={$tabID} and UserID = {$userID}
                    and AL.parentList = 0
                    ORDER BY is_complete,time_complete";
                }    

                $result = $conn->query($sql);
        
                $result_arr = array();
                while ($row = $result->fetch_assoc()) {
                    array_push($result_arr,$row);
                    $row_id = $row['ID'];
                    
                    if($tabType == 1){
                        $sql = "SELECT AL.*,
                        (
                            CASE WHEN is_continue THEN CONCAT(activity_name,' #',activity_days)
                            ELSE activity_name END
                        ) as activity_name
                        FROM `ActivityList` AL
                        INNER JOIN `ActivityMaster` AM
                        ON AL.Activity = AM.ID
                        WHERE Activity_Date = '{$_POST['date']}' and tabID={$tabID} 
                        and UserID = {$userID} and AL.parentList = {$row_id}
                        ORDER BY is_complete,ID";

                    }else{
                        $sql="SELECT AL.*, activity_name
                        FROM `ActivityList` AL
                        INNER JOIN `ActivityMaster` AM
                        ON AL.Activity = AM.ID
                        WHERE tabID={$tabID} and UserID = {$userID}
                        and AL.parentList = {$row_id}
                        ORDER BY is_complete,Activity_Date";

                    }

                    $resultSubList = $conn->query($sql);
                    while($subList = $resultSubList->fetch_assoc()){
                        array_push($result_arr,$subList);
                    }

                }
            }elseif( $tabType == 4 ){
                if(isset($_POST['date'])){
                    $date = $_POST['date'];
                    $tabID = $_POST['tabID'];
                    updateContinueActivityList($date,$tabID,$token);
                    //get List from daily tab type
                    $sql = "SELECT AL.*,
                    (
                        CASE WHEN is_continue THEN CONCAT(activity_name,' #',activity_days)
                        ELSE activity_name END
                    ) as activity_name,
                    (
                        SELECT COUNT(*) FROM ActivityList WHERE parentList = AL.ID 
                        AND Activity_Date = '{$_POST['date']}' and tabID={$tabID}
                        and UserID = {$userID}
                    ) as amountSubList
                    FROM `ActivityList` AL
                    INNER JOIN `ActivityMaster` AM
                    ON AL.Activity = AM.ID
                    WHERE Activity_Date = '{$_POST['date']}' and tabID={$tabID} 
                    and UserID = {$userID} and AL.parentList = 0 AND AL.amount >= 0
                    ORDER BY ID";

                    $result = $conn->query($sql);
                            
                    $result_arr = array();
                    while ($row = $result->fetch_assoc()) {
                        array_push($result_arr,$row);
                    }

                    $sql = "SELECT AL.*,
                    (
                        CASE WHEN is_continue THEN CONCAT(activity_name,' #',activity_days)
                        ELSE activity_name END
                    ) as activity_name,
                    (
                        SELECT COUNT(*) FROM ActivityList WHERE parentList = AL.ID 
                        AND Activity_Date = '{$_POST['date']}' and tabID={$tabID}
                        and UserID = {$userID}
                    ) as amountSubList
                    FROM `ActivityList` AL
                    INNER JOIN `ActivityMaster` AM
                    ON AL.Activity = AM.ID
                    WHERE Activity_Date = '{$_POST['date']}' and tabID={$tabID} 
                    and UserID = {$userID} and AL.parentList = 0 AND AL.amount < 0
                    ORDER BY ID";

                    $result = $conn->query($sql);
                    while ($row = $result->fetch_assoc()) {
                        array_push($result_arr,$row);
                    }

                }

            }else{
                $sql = "SELECT AL.*, activity_name,
                (
                    SELECT COUNT(*) FROM ActivityList WHERE parentList = AL.ID 
                    AND tabID={$tabID} and UserID = {$userID}
                ) as amountSubList
                FROM `ActivityList` AL
                INNER JOIN `ActivityMaster` AM
                ON AL.Activity = AM.ID
                WHERE tabID={$tabID} and UserID = {$userID}
                and AL.parentList = 0
                ORDER BY is_complete,time_complete";

                $result = $conn->query($sql);
                        
                $result_arr = array();
                while ($row = $result->fetch_assoc()) {
                    array_push($result_arr,$row);
                    $row_id = $row['ID'];
                    
                    if($tabType == 1){
                        $sql = "SELECT AL.*,
                        (
                            CASE WHEN is_continue THEN CONCAT(activity_name,' #',activity_days)
                            ELSE activity_name END
                        ) as activity_name
                        FROM `ActivityList` AL
                        INNER JOIN `ActivityMaster` AM
                        ON AL.Activity = AM.ID
                        WHERE Activity_Date = '{$_POST['date']}' and tabID={$tabID} 
                        and UserID = {$userID} and AL.parentList = {$row_id}
                        ORDER BY is_complete,ID";

                    }else{
                        $sql="SELECT AL.*, activity_name
                        FROM `ActivityList` AL
                        INNER JOIN `ActivityMaster` AM
                        ON AL.Activity = AM.ID
                        WHERE tabID={$tabID} and UserID = {$userID}
                        and AL.parentList = {$row_id}
                        ORDER BY is_complete,Activity_Date";

                    }

                    $resultSubList = $conn->query($sql);
                    while($subList = $resultSubList->fetch_assoc()){
                        array_push($result_arr,$subList);
                    }

                }
            }
        }
        
        

        echo json_encode($result_arr);
        $result->free();
        mysqli_close($conn);


    }else{
        echo '{"msg_code":0,"msg":"Unauthorize token"}';
    }

    
}

function insertAct($name){
    global $conn;

    //Insert new activity to Activity master
    $sql = "INSERT INTO ActivityMaster(activity_name) VALUES('{$name}')";
    
    $result = $conn->query($sql);
    
    //Get Lastest ID return for demonstrate add activity status
    $sql = "SELECT ID FROM ActivityMaster WHERE activity_name = '{$name}'";
    $result_select = $conn->query($sql);
    $ID = "";
    while ($row = $result_select->fetch_assoc()) {
        $ID = $row['ID'];
    }

    if($result){        
        echo '{"msg_code":1,"msg":"success","ID":'.$ID.'}';
    }else{
        echo '{"msg_code":0,"msg":"duplicate inserted","ID":'.$ID.'}';
    }
    $result->free();
    mysqli_close($conn);
}

function insertList($ID,$tabID,$is_continue,$is_reset,$date,$token,$parentList,$amount,$group){
    global $conn;

    $userID = getUserIDByToken($token);

    if($userID){

        // Check duplicate activity in the date
        $sql =" SELECT 1 as n FROM ActivityList WHERE Activity = {$ID}
        and Activity_Date = '{$date}' and tabID = {$tabID} and UserID={$userID}
        and parentList = {$parentList}
        GROUP BY Activity_Date
        HAVING COUNT(*) >= 1";

        $result = $conn->query($sql);

        while ($row = $result->fetch_assoc()) {
            $n = $row['n'];
        }
        
        if(!$n){
            if($is_continue){

                // Get days amount to insert to continue activity
                $sql =" SELECT AL.* 
                FROM ActivityList AL
                WHERE AL.Activity = {$ID} 
                AND AL.is_complete = 1 
                and AL.tabID = {$tabID} 
                and AL.UserID={$userID}
                AND (
                    AL.Activity_Date BETWEEN 
                    (
                        CASE WHEN 
                        ( 
                            SELECT 1 
                            FROM UserAction 
                            WHERE user = {$userID} 
                            AND object = AL.Activity 
                            AND action_date < '{$date}'
                            AND action = 'Reset Continue Activity' LIMIT 1
                        ) = 1 
                        THEN 
                        (
                            SELECT MAX(action_date) 
                            FROM UserAction 
                            WHERE user = {$userID} 
                            AND object = AL.Activity 
                            AND action_date < '{$date}'
                            AND action = 'Reset Continue Activity'
                        )
                        ELSE 
                        (
                            SELECT MIN(Activity_Date) 
                            FROM ActivityList 
                            WHERE UserID = {$userID} 
                            AND Activity = AL.Activity
                            AND Activity_Date < '{$date}'
                        )
                        END 
                    ) AND '{$date}'
                )
                ORDER BY AL.ID desc LIMIT 1";
        
                $result = $conn->query($sql);
        
                while ($row = $result->fetch_assoc()) {
                    $activity_days = $row['activity_days'];
                }
                $activity_days += 1;

                if($is_reset){
                    // Resert Continue Activity List
                    $sql = "INSERT INTO ActivityList(Activity_Date,UserID,Activity,activity_days,
                    is_continue,tabID,parentList) 
                    VALUES('{$date}',{$userID},{$ID},1,{$is_continue},{$tabID},{$parentList})"; 

                    recordAction($userID,'Reset Continue Activity',$ID,$date);
                }else{
                    // Insert continue activity list and update activity_days
                    $sql = "INSERT INTO ActivityList(Activity_Date,UserID,Activity,activity_days,
                    is_continue,tabID,parentList) 
                    VALUES('{$date}',{$userID},{$ID},{$activity_days},{$is_continue},{$tabID},
                    {$parentList})"; 
                    recordAction($userID,'Create Continue Activity',$ID,$date);
                }

                
            }else{

                if(!$amount){
                    $amount = 1;
                }

                if($amount==1){
                    //Insert discrete activity
                    $sql = "INSERT INTO ActivityList(Activity_Date,UserID,Activity,activity_days,
                    is_continue,tabID,parentList,amount) 
                    VALUES('{$date}',{$userID},{$ID},0,0,{$tabID},{$parentList},{$amount})";
                    recordAction($userID,'Create Activity',$ID,$date);
                }else{
                    //Insert discrete activity
                    $sql = "INSERT INTO ActivityList(Activity_Date,UserID,Activity,activity_days,
                    is_continue,tabID,transactionGroup,parentList,amount,time_complete) 
                    VALUES('{$date}',{$userID},{$ID},0,0,{$tabID},{$group},{$parentList},{$amount},NOW())";
                    recordAction($userID,'Create Transaction',$ID,$date);
                }

        
            }
        
            $result = $conn->query($sql);
            if($result){        
                recordAction($userID,'Create Activity Success',$ID,$date);
                echo '{"msg_code":1,"msg":"success"}';
            }else{
                recordAction($userID,'Create Activity Fail (*Duplicate Insert)',$ID,$date);
                echo '{"msg_code":0,"msg":"duplicate inserted"}';
            }
            
            $result->free();
            mysqli_close($conn);
        }else{
            recordAction($userID,'Create Activity Fail (*Duplicate Insert)',$ID,$date);
            echo '{"msg_code":0,"msg":"Can not duplicate inserted in the day"}';
        }
   
    }else{
        echo '{"msg_code":0,"msg":"Unauthorize token"}';
    }

}

function checkedList($ID,$token){

    global $conn;

    $userID = getUserIDByToken($token);

    if($userID){

        $sql = "SELECT is_complete FROM ActivityList WHERE ID = {$ID}";
        $resultComplete = $conn->query($sql);

        while($row=$resultComplete->fetch_assoc()){
            if(!$row['is_complete']){
                $sql = "UPDATE ActivityList set is_complete = not is_complete ,
                time_complete = CURRENT_TIME() 
                where ID = {$ID}";
            }else{
                $sql = "UPDATE ActivityList set is_complete = not is_complete ,
                time_complete = NULL
                where ID = {$ID}";
            }
        }

        
        $result = $conn->query($sql);
        
        if($result){        
            echo '{"msg_code":1,"msg":"success"}';
        }else{
            echo '{"msg_code":0,"msg":"fail"}';
        }
        $result->free();
        mysqli_close($conn);

    }else{
        echo '{"msg_code":0,"msg":"Unauthorize token"}';
    }

    

}

function deleteList($token,$ID){

    global $conn;

    $userID = getUserIDByToken($token);

    if($userID){

        $sql = "SELECT * 
        FROM ActivityList
        WHERE ID = {$ID}";
        $result = $conn->query($sql);

        while($row=$result->fetch_assoc()){
            $date = $row['Activity_Date'];
            $activity = $row['Activity'];
        }

        $sql ="DELETE FROM UserAction 
        WHERE user = {$userID} 
        AND action = 'Reset Continue Activity'
        AND object = {$activity}
        AND action_date = '{$date}'";
        $result = $conn->query($sql);

        $sql = "DELETE FROM ActivityList WHERE ID = {$ID}";
        $result = $conn->query($sql);
        
        if($result){        
            echo '{"msg_code":1,"msg":"delete success"}';
            recordAction($userID,'Delete Activity Success',$activity,$date);
        }else{
            echo '{"msg_code":0,"msg":"delete fail"}';
            recordAction($userID,'Delete Activity Fail',$activity,$date);
        }
        $result->free();
        mysqli_close($conn);

    }else{
        echo '{"msg_code":0,"msg":"Unauthorize token"}';
    }

    
}

function deleteTab($ID,$token){

    $userID = getUserIDByToken($token);

    if($userID){
    
        global $conn;

        $sql = "DELETE FROM ActivityList 
        WHERE TabID = {$ID} AND UserID = {$userID} ";
        $result = $conn->query($sql);
        
        $sql = "DELETE FROM TabListMaster 
        WHERE ID = {$ID} AND UserID = {$userID} ";
        $result = $conn->query($sql);

        if($result){        
            recordAction($userID,'Delete Tab Success',$ID,date('Y-m-d'));
            echo '{"msg_code":1,"msg":"delete success"}';
        }else{
            recordAction($userID,'Delete Tab Fail',$ID,date('Y-m-d'));
            echo '{"msg_code":0,"msg":"delete fail"}';
        }
        $result->free();
        mysqli_close($conn);
    
    }else{
        echo '{"msg_code":0,"msg":"Unauthorize token"}';
    }
    
}

function getLatestDateActivity($token,$activity_name,$date){

    $userID = getUserIDByToken($token);

    if($userID){

        global $conn;

        $sql = "SELECT AL.activity_days 
        FROM `ActivityList` AL 
        INNER JOIN ActivityMaster AM 
        ON AL.Activity = AM.ID
        WHERE AM.activity_name = '{$activity_name}' 
        and AL.UserID = {$userID}
        AND AL.Activity_Date < '{$date}'
        ORDER BY AL.ID desc
        LIMIT 1";

        $result = $conn->query($sql);
            
        while ($row = $result->fetch_assoc()) {

            $activity_days = $row['activity_days']+1;        
        }

        if(!$activity_days){
            $activity_days = 1;
        }

        if($result){        
            echo '{"msg_code":1,"last_day":'.$activity_days.'}';
        }else{
            echo '{"msg_code":0,"msg":"fail"}';
        }
        $result->free();
        mysqli_close($conn);

    }else{
        echo '{"msg_code":0,"msg":"Unauthorize token"}';
    }

    
}

function cloneList($token,$Clonedate,$SetDate,$tabID){

    $userID = getUserIDByToken($token);

    if($userID){

        global $conn;
        $sql = "SELECT * FROM ActivityList WHERE Activity_Date='{$Clonedate}' 
        and Activity not in (
            select Activity From ActivityList 
            WHERE Activity_Date='{$SetDate}' 
            AND TabID = {$tabID}
            AND UserID = {$userID}
        ) AND TabID = {$tabID} AND UserID = {$userID}
        ORDER BY time_complete";

        $result = $conn->query($sql);

        while ($row = $result->fetch_assoc()) {

            $activity = $row['Activity'];
            $activity_days = $row['activity_days'];
            $tabID = $row['TabID'];

            if($row['is_continue']){

                if($row['is_complete']){
                    $activity_days += 1;
                    $sql ="INSERT INTO ActivityList(Activity_Date,UserID,
                    Activity,activity_days,is_continue,tabID) 
                    VALUES('{$SetDate}',{$userID},{$activity},{$activity_days},1,$tabID)";
                    
                }else{
                    $sql ="INSERT INTO ActivityList(Activity_Date,UserID,
                    Activity,activity_days,is_continue,tabID) 
                    VALUES('{$SetDate}',{$userID},{$activity},{$activity_days},1,$tabID)";
                    
                }
                
            }else{
                $sql ="INSERT INTO ActivityList(Activity_Date,UserID,
                Activity,activity_days,is_continue,tabID) 
                VALUES('{$SetDate}',{$userID},{$row['Activity']},0,0,$tabID)";    
                
            }
            
            $result1 = $conn->query($sql);
        }

        $result->free();
        echo '{"msg":"clone success"}';
        recordAction($userID,'Clone List '.$Clonedate,0,$SetDate);
        mysqli_close($conn);

    }else{
        echo '{"msg_code":0,"msg":"Unauthorize token"}';
    }

    
}

function create_tab($TabName,$Type,$token){
    
    $userID = getUserIDByToken($token);

    if($userID){
        global $conn;

        $sql = " INSERT INTO TabListMaster(UserID,TabName,type) VALUES({$userID},'{$TabName}',{$Type})";
        $result = $conn->query($sql);

        $sql = "SELECT ID FROM TabListMaster WHERE TabName = '{$TabName}' ";
        $result1 = $conn->query($sql);

        while($row = $result1->fetch_assoc()){
            $ID = $row['ID'];
        }

        if($result){
            recordAction($userID,'Create tab success',$ID,date('Y-m-d'));
            echo '{"msg":"create success"}';
        }else{
            recordAction($userID,'Create tab fail',$ID,date('Y-m-d'));
            echo '{"msg":"create error"}';
        }
        $result->free();
        mysqli_close($conn);


    }else{
        echo '{"msg_code":0,"msg":"Unauthorize token"}';
    }
    
}

function getTabList($token){
    
    $userID = getUserIDByToken($token);

    if($userID){
        global $conn;

        $sql = "SELECT * FROM TabListMaster
        WHERE UserID = {$userID}";
        $result = $conn->query($sql);

        $TabList = array();
        while ($row = $result->fetch_assoc()) {
            array_push($TabList,$row);
        }

        echo json_encode($TabList);

        $result->free();
        mysqli_close($conn);
    
    }else{
        echo '{"msg_code":0,"msg":"Unauthorize token"}';
    }

}

function getDefaultTabList($token){

    $userID = getUserIDByToken($token);

    if($userID){
        global $conn;

        $sql = "SELECT * FROM TabListMaster 
        WHERE UserID = {$userID}
        ORDER BY ID LIMIT 1";
        $result = $conn->query($sql);

        while ($row = $result->fetch_assoc()) {
            $Tab = $row;
        }

        echo json_encode($Tab);

        $result->free();
        mysqli_close($conn);

    }else{
        echo '{"msg_code":0,"msg":"Unauthorize token"}';
    }
    
}

function encodeAccessKey($NumberKey){

    $HashKey = "$$";
    for($i=0;$i<strlen($NumberKey);$i++){
        $alphabet = chr(65+(int)$NumberKey[$i]);
        $HashKey .= $alphabet;
        $HashKey .= chr(rand(65,91));
        $HashKey .= chr(rand(65,91));
        $HashKey .= chr(rand(65,91));
        $HashKey .= chr(rand(65,91));
        $HashKey .= chr(rand(65,91));
        $HashKey .= chr(rand(65,91));
        $HashKey .= chr(rand(65,91));
    }
    $HashKey .= "XX";

    return $HashKey;

}

function decodeAccessKey($HashKey){

    $AccessKey = "";
    for($i=2;$i<43;$i+=8){
        $AccessKey .= (ord($HashKey[$i])-65);
    }

    return $AccessKey;
    
}

function decodeRecieverKey($RecieveKey){

    $AccessKey = "";
    for($i=7;$i<38;$i+=6){
        $AccessKey .= (ord($RecieveKey[$i])-65);
    }

    return $AccessKey;
}

function checkEmail($email){

    if($email){
        $email = trim($email," ");
        global $conn;
        $sql = "SELECT 1 as found 
        FROM User 
        WHERE Email = '{$email}'";

        $result = $conn->query($sql);

        if($result->num_rows){
            while ($row = $result->fetch_assoc()) {
                if($row['found']){
                    $msg = '{"msg":1}';
                }else{
                    $msg = '{"msg":0}';
                }
            }
        }else{
            $msg = '{"msg":0}';
        }


        echo $msg;
        $result->free();
        mysqli_close($conn);
    }else{
        $msg = '{"msg":0}';
        echo $msg;
    }
}

function signin($email,$password){

    if($email && $password){
        $email = trim($email," ");
        global $conn;
        $sql = "SELECT *
        FROM User 
        WHERE Email = '{$email}'";

        $SignInSuccess = 0;
        $result = $conn->query($sql);
        $AccessKey = decodeRecieverKey($password);
        $userID = "";
        while($row = $result->fetch_assoc()){
            $KeyFromDB = decodeAccessKey($row['AccessKey']);
            if($KeyFromDB == $AccessKey){
                $SignInSuccess = 1;
                $userID = $row['ID'];
            }
        }

        if($SignInSuccess){
            
            //Generate Token length 20 character
            $token = "";
            for($i=0;$i<20;$i++){
                $token .= chr(rand(65,90));
            }
            //Insert Token Map User
            $sql = "INSERT INTO UserToken(User_id,token) VALUES({$userID},'{$token}')";
            $resultToken = $conn->query($sql);
            $msg = '{"token":"'.$token.'"}';
            echo $msg;
            recordAction($userID,'Signin success',0,date('Y-m-d'));
        }else{
            echo '{"msg":0}';
        }
        
    }else{
        echo '{"msg":0}';
    }
    

}

function getUserIDByToken($token){
 
    if($token){
        global $conn;
        
        $sql = "SELECT User_id FROM UserToken WHERE token = '{$token}'";

        $resultQuery = $conn->query($sql);
        $result = $resultQuery;

        if($result){
            while($row=$result->fetch_assoc()){
                $userID = $row['User_id'];
            }
            
            return $userID;
        }else{

            return 0;
        }

    }else{
        return 0;
    }

}

function recordAction($userID,$action,$activity,$action_date){

    global $conn;

    $sql = "INSERT INTO UserAction(user,action,object,action_date) 
    VALUES({$userID},'{$action}',{$activity},'{$action_date}')";

    $result = $conn->query($sql);

}

function getImgBackground($token){
    $userID = getUserIDByToken($token);

    if($userID){
        global $conn;
        $sql ="SELECT img FROM User WHERE ID = {$userID}";
        $result = $conn->query($sql);

        $url = "";
        while($row=$result->fetch_assoc()){
            $url = $row['img'];
        }

        echo "{\"img\":\"{$url}\"}";
    }else{
        echo '{"img":"0:}';
    }
}

function updateImgBackground($token,$img){
    $userID = getUserIDByToken($token);

    if($userID){
        global $conn;
        $sql ="UPDATE User SET img = '{$img}' WHERE ID = {$userID}";
        $result = $conn->query($sql);

        echo '{"msg":"success update"}';
    }else{
        echo '{"msg_code":0,"msg":"Unauthorize token"}';
    }
}

function getGroupList($token,$tabID){
    $userID = getUserIDByToken($token);

    if($userID){
        global $conn;

        $sql = "SELECT TG.ID,TG.GroupName,TG.color FROM TransactionGroup TG
        INNER JOIN TabListMaster TL
        ON TG.TabID = TL.ID 
        AND TL.UserID = {$userID}
        AND TG.TabID = {$tabID}";

        $result = $conn->query($sql);
        
        $transGroup = array();
        while ($row = $result->fetch_assoc()) {
            $r = array(
                "ID"=>$row['ID'],
                "label"=>$row['GroupName'],
                "color"=>$row['color']
            );
            array_push($transGroup,$r);
        }

        echo json_encode($transGroup);

        $result->free();
        mysqli_close($conn);

    }else{
        echo '{"msg_code":0,"msg":"Unauthorize token"}';
    }
}

function createGroup($token,$groupName,$tabID){
    $userID = getUserIDByToken($token);

    if($userID){
        global $conn;

        $sql = "INSERT INTO TransactionGroup(GroupName,color,TabID) 
        VALUES('{$groupName}','black',{$tabID})";

        $result = $conn->query($sql);
        
        if($result){

            $sql = "SELECT ID,GroupName
            FROM TransactionGroup 
            WHERE GroupName = '{$groupName}'";
            $result2 = $conn->query($sql);

            while($row = $result2->fetch_assoc()){
                $id = $row['ID'];
                $name = $row['GroupName'];
            }

            echo '{
                    "msg_code":1,
                    "msg":"Create group was successed",
                    "ID":'.$id.',
                    "groupName":"'.$name.'"
                  }';
        }else{
            echo '{"msg_code":0,"msg":"Create group was fail!"}';
        }

        $result->free();
        mysqli_close($conn);

    }else{
        echo '{"msg_code":0,"msg":"Unauthorize token"}';
    }
}

// get report date from user token
function getReportDate($token,$tabID){
    $userID = getUserIDByToken($token);

    if($userID){
        global $conn;
        
        $sql = "SELECT ListValue
        FROM UserListData 
        WHERE UserID = {$userID} AND ListName = 'Report_Date_{$tabID}'";
        $result = $conn->query($sql);

        while($row = $result->fetch_assoc()){
            $report_date = $row['ListValue'];
        }
        
        if($report_date){
            echo '{
                "msg_code":1,
                "report_date":"'.$report_date.'"
              }';    
        }else{
            echo '{
                "msg_code":1,
                "report_date":"'.Date('d').'",
                "tabID":"'.$tabID.'"
              }';
        }
        
        $result->free();
        mysqli_close($conn);
    }else{
        echo '{"msg_code":0,"msg":"Unauthorize token"}';
    }
}

// insert and update mark report date for each user
function updateDateForReport($token,$report_date,$tabID){
    $userID = getUserIDByToken($token);

    if($userID){
        global $conn;

        // 1. check Is exist the list value?
        $sql = "SELECT ListValue
        FROM UserListData 
        WHERE UserID = {$userID} AND ListName = 'Report_Date_{$tabID}'";
        $result = $conn->query($sql);

        while($row = $result->fetch_assoc()){
            $get_report_date = $row['ListValue'];
        }
        
        // 2. if exist then update value
        if($get_report_date){
            $sql = "UPDATE UserListData 
            SET ListValue = '{$report_date}' 
            WHERE UserID = {$userID} AND ListName = 'Report_Date_{$tabID}'";
            $result = $conn->query($sql);

            echo '{
                "msg_code":1,
                "message":"update report date successful"
              }';    
        }
        // 3. else insert
        else 
        {
            $sql = "INSERT INTO UserListData(UserID,ListName,ListValue)
            VALUES({$userID},'Report_Date_{$tabID}',{$report_date})";
            $result = $conn->query($sql);

            echo '{
                "msg_code":1,
                "message":"insert report date successful"
              }';
        }

        $result->free();
        mysqli_close($conn);
    }else{
        echo '{"msg_code":0,"msg":"Unauthorize token"}';
    }
}

// get List Report 
function getReport($token,$tabID,$detail){
    $userID = getUserIDByToken($token);

    if($userID){
        global $conn;
        // get report date from database 
        $sql = "SELECT ListValue
        FROM UserListData 
        WHERE UserID = {$userID} AND ListName = 'Report_Date_{$tabID}'";
        $result = $conn->query($sql);

        while($row = $result->fetch_assoc()){
            $report_date = $row['ListValue'];
        }

        // 1. check tabID
        // 2. if tabID is dailylist(1) then GROUP BY activity_master
        if((int)$tabID==1)
        {
            $dateYMD = Date('Y-m-').$report_date;
            $sql = "SELECT Activity_name,SUM(amount) as n FROM `ActivityList` 
            INNER JOIN ActivityMaster AM ON
            AM.ID = ActivityList.Activity
            WHERE Activity_Date BETWEEN DATE_SUB('{$dateYMD}',INTERVAL 1 MONTH) AND '{$dateYMD}' 
            AND TabID = 1 AND UserID = {$userID}
            GROUP BY Activity
            ORDER BY SUM(amount) DESC";
            
            $result = $conn->query($sql);
            $reportList = array();
            while($row = $result->fetch_assoc()){
                $report = array(
                    "activity_name"=>$row['Activity_name'],
                    "activity_freq"=>$row['n']
                );
                array_push($reportList,$report);
            }
            echo json_encode($reportList);

        }
        // 3. if tabID is transaction(17) then GROUP BY transaction_group
        elseif((int)$tabID==17)
        {
            $dateYMD = Date('Y-m-').$report_date;
            // get transaction detail with report
            if((int)$detail==1)
            {
                $sql = "SELECT Activity_name,SUM(amount) as n FROM `ActivityList` 
                INNER JOIN ActivityMaster AM ON
                AM.ID = ActivityList.Activity
                WHERE Activity_Date BETWEEN DATE_SUB('{$dateYMD}',INTERVAL 1 MONTH) AND '{$dateYMD}' 
                AND TabID = 17 AND UserID = {$userID}
                GROUP BY Activity
                ORDER BY SUM(amount) DESC
                ";

                $result = $conn->query($sql);
                $reportList = array();
                while($row = $result->fetch_assoc()){
                    $report = array(
                        "activity_name"=>$row['Activity_name'],
                        "activity_freq"=>$row['n']
                    );
                    array_push($reportList,$report);
                }
            }
            // get transaction group with report
            else
            {
                $sql = "SELECT TG.GroupName,SUM(amount) as n FROM `ActivityList` 
                INNER JOIN TransactionGroup TG ON
                TG.ID = ActivityList.transactionGroup
                WHERE Activity_Date BETWEEN DATE_SUB('{$dateYMD}',INTERVAL 1 MONTH) AND '{$dateYMD}' 
                AND ActivityList.TabID = 17 AND UserID = {$userID}
                GROUP BY transactionGroup
                ORDER BY SUM(amount) DESC";

                $result = $conn->query($sql);
                $reportList = array();
                while($row = $result->fetch_assoc()){
                    $report = array(
                        "activity_name"=>$row['GroupName'],
                        "activity_freq"=>$row['n']
                    );
                    array_push($reportList,$report);
                }
            }
            
            
            echo json_encode($reportList);
        }
        // 4. else nothing to return
        else
        {
            echo '{}';
        }
        
    }else{
        echo '{"msg_code":0,"msg":"Unauthorize token"}';
    }
}

if(file_get_contents('php://input')){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

if(isset($_POST['action'])){

    $action = $_POST['action'];
    
    switch ($action) {
        case "get_actMaster":
            getActivityMaster($_POST['keyword']);
            break;
        case "get_actList":
            getActivityList($_POST['token']);
            break;
        case "insert_act":
            insertAct($_POST['act_name']);
            break;
        case "insert_actList":
            insertList($_POST['ID'],$_POST['tabID'],$_POST['is_continue'],$_POST['is_reset'],$_POST['date'],
            $_POST['token'],$_POST['parentList'],$_POST['amount'],$_POST['group']);
            break;
        case "select_list":
            checkedList($_POST['ID'],$_POST['token']);
            break;
        case "delete_list":
            deleteList($_POST['token'],$_POST['ID']);
            break;
        case "deleteTab":
            deleteTab($_POST['ID'],$_POST['token']);
            break;
        case "get_latest_date_act":
            getLatestDateActivity($_POST['token'],$_POST['activity_name'],$_POST['acttivity_date']);
            break;
        case "cloneList":
            cloneList($_POST['token'],$_POST['CloneDate'],$_POST['SetDate'],$_POST['tabID']);
            break;
        case "create_tab":
            create_tab($_POST['TabName'],$_POST['Type'],$_POST['token']);
            break;
        case "getTabList":
            getTabList($_POST['token']);
            break;
        case "getDefaultTabList":
            getDefaultTabList($_POST['token']);
            break;
        case "checkEmail":
            checkEmail($_POST['email']);
            break;
        case "signin":
            signin($_POST['email'],$_POST['accessKey']);
            break;
        case "updateImageBackground":
            updateImgBackground($_POST['token'],$_POST['path']);
            break;
        case "getImageBackground":
            getImgBackground($_POST['token']);
            break;
        case "getGroupList":
            getGroupList($_POST['token'],$_POST['tabID']);
            break;
        case "createGroup":
            createGroup($_POST['token'],$_POST['groupName'],$_POST['tabID']);
            break;
        case "getReportDate": 
            getReportDate($_POST['token'],$_POST['tabID']);
            break;
        case "updateDateForReport": 
            updateDateForReport($_POST['token'],$_POST['report_date'],$_POST['tabID']);
            break;
        case "getReport":
            getReport($_POST['token'],$_POST['tabID'],$_POST['detail']);
            break;
        default:
            echo "There aren't action.";
    }    
    
}


?>