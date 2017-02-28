'use strict';
var portal = angular.module('portal', ['ngRoute','ngCookies']);


portal.directive('exporttocsv',function(){
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var el = element[0];
        var tab= document.getElementById('tablevol');
          element.bind('click', function(e){
            var table = e.target.nextElementSibling;
            var csvString = '';
            for(var i=0; i<tab.rows.length;i++){
              var rowData = tab.rows[i].cells;
              for(var j=0; j<rowData.length-1;j++){
                csvString = csvString + rowData[j].innerHTML + ",";
              }
              csvString = csvString.substring(0,csvString.length - 1);
              csvString = csvString + "\n";
          }
            csvString = csvString.substring(0, csvString.length - 1);
            var a = $('<a/>', {
                style:'display:none',
                href:'data:application/octet-stream;base64,'+btoa(csvString),
                download:'volunteerslist.csv'
            }).appendTo('body')
            a[0].click()
            a.remove();
          });
      }
    }
  });




  portal.controller('ctrlreg',['$scope', '$location','$http','$cookies',function($scope, $location,$http,$cookies){
    $('.err').show();
      if($cookies.get("username")=='admin')
      {
          $scope.loggedIn=true;
          $('.land').hide();
           $location.path('/admin');  
                 
      }  
      else if($cookies.get("username")&&$cookies.get("role")=='Organiser')
      {
        $scope.loggedIn= true;

        $('.land').hide();
          $location.path('/dashboard');  
      }
      else if($cookies.get("username")&&$cookies.get("role")=='Volunteer')
      {
        $scope.loggedIn= true;
        $('.land').hide();
          $location.path('/volunteer');  
      }
      else
      {
        $scope.loggedIn=false;
//        $('#main').show();
        $location.path('/');
      }
    $scope.portallink = function(){
      $('#header').hide();
      $('#main').show();

    };
      //Login  
     $scope.log = function(){

      if($scope.in.emai=="root@uvce.com"&&$scope.in.pas=="impetus")
      { 
                    var expiredate = new Date();
                    expiredate.setDate(expiredate.getDate() + 3);
                 
                $cookies.put("username","admin",{
                  'expires': expiredate

                });
               $('#main').hide();
                
                   $location.path('/admin');  
                   $scope.loggedIn=true;
                   $scope.in= {};
      }
      else{ console.log($scope.in);
        $http.post('api/user/login',$scope.in).then(function(res){
            
          
                  $scope.in= {};
                   console.log("working");


              if(res.data== "Incorrect Email/Password"){    
              $scope.message = "Incorrect Email/Password"; 
                  }
                  else
                  {
                     var expiredate = new Date();
                    expiredate.setDate(expiredate.getDate() + 3);
                 
                $cookies.put("username",res.data.email,{
                  'expires': expiredate

                });
                $cookies.put("role",res.data.role,{
                  'expires': expiredate

                });
                console.log(res);
                     $scope.message='';
                   if(res.data.role=='Organiser')
                   $location.path('/dashboard');  
                 else
                  $location.path('/volunteer');
                    console.log("signed in");
                     $('#main').hide();
                    $scope.loggedIn= true;


              }

              
             },function(){
              console.log("error");
              
              
             });
      }
    };

      //Signup function
    $scope.sign = function() {
          console.log($scope.user);
          $http.post('api/user/signup',$scope.user).then(function(response){
              console.log("registered");
              $scope.user= {};
              console.log(response);
              $scope.signmess = response.data;
             

    });
   };

   //Logout
     $scope.logout = function(){
        
            console.log("log out");
         $cookies.remove("username"); 
          $cookies.remove("role"); 
       //$window.localStorage.removeItem("username");
          $scope.loggedIn= false;
          $('.land').show();
          $('#main').show();


    $location.path('/');
        

    };



//---------------------- ORGANISER SIDE--------------------------------------------------------------
    //Load data for user 
    $scope.loaddata= function()
    {   var user ={ email: $cookies.get('username')};
        user = JSON.stringify(user);
      console.log(user);
      $('#form').hide();
      $('#table').show();
      $('#edit').hide();
       $http.post('api/user/loaddata',user).then(function(res)
                    {
                        if(res.data){
                          console.log(res);
                          $scope.info= res.data;
                          console.log(res.data.userdata.org1);

                         // $('.userform').attr("readonly", true);
                        }
                    });
    };


    //Opening edit form for user
    $scope.editorg = function(){
        $('#table').hide();
        $('#edit').show();

        var user =  {email: $cookies.get('username')};
        user= JSON.stringify(user);
        $scope.data = $scope.info;

        //Set value of Input form
        var email = $cookies.get('username');
        $('#email').val(email).trigger('change');
        $('#date').val($scope.data.userdata.date).trigger('change');
        $('#org1').val($scope.data.userdata.org1).trigger('change');
        $('#org2').val($scope.data.userdata.org2).trigger('change');
        $('#org3').val($scope.data.userdata.org3).trigger('change');
        $('#cont1').val($scope.data.userdata.cont1).trigger('change');
        $('#cont2').val($scope.data.userdata.cont2).trigger('change');
        $('#cont3').val($scope.data.userdata.cont3).trigger('change');
        $('#event').val($scope.data.userdata.eventname).trigger('change');
        $('#duration').val($scope.data.userdata.duration).trigger('change');
        $('#team').val($scope.data.userdata.team).trigger('change');
        $('#bud').val($scope.data.userdata.bud).trigger('change');
         $('#vol').val($scope.data.userdata.vol).trigger('change');
           $('#items').val($scope.data.userdata.items).trigger('change');
        $('#desc').val($scope.data.userdata.desc).trigger('change');
       
        //testing
        console.log($scope.data.userdata.org1);

    }

    //Update edit form for user
    $scope.updateorg =function(){
      console.log($scope.user);
      $http.post('api/user/update',$scope.user).then(function(response)
      {
          console.log(response);
          $scope.message= response.data;
          $scope.user={};

      });
    };


    // Submit organiser form
   $scope.orgsub = function(){
    console.log($scope.user);
           $('.userform').attr("readonly", true);
         
          $http.post('/api/user/data',$scope.user).then(function(response){
            console.log("data inserted");
            $scope.message = response.data;
            $scope.user= {};
        
        });
    };
    
    // Update User
     $scope.update = function(){
        $http.post('/api/user/update',$scope.user).then(function(response){
            console.log("data inserted");
            $scope.user={};
        });
    };






  //----------------------- ADMIN SIDE---------------------------------

    //Load for admin
   $scope.find1= function(){
     $http.post('/api/admin/loadday1').then(function(res){
                      console.log("working");
                      var alldata1={};
                       $scope.alldata1= res.data;
                     viewoneall();
                   }),function(){
                    console.log("error");
                   };
          };
 $scope.find2= function(){
     $http.post('/api/admin/loadday2').then(function(res){
                      console.log("working");
                      var alldata2={};
                       $scope.alldata2= res.data;
                     viewtwoall();
                   }),function(){
                    console.log("error");
                   };
          };
$scope.find = function()
{
   $http.post('/api/admin/loadall').then(function(res){
                      console.log("working");
                      var alldata={};
                       $scope.alldata= res.data;
                     viewall();
                   }),function(){
                    console.log("error");
                   };

};

  //open admin's edit panel
  $scope.edit = function(user){
      $('#editpanel').show();
      $('#view1').hide();
      $('#view2').hide();
      $('#viewvol').hide();
      $('#viewall').hide();
      
        $scope.info = user.userdata;
        $scope.data= user;
        //Set value of edit form
        
        $('#date2').val($scope.info.date).trigger('change');
        $('#email2').val($scope.data.email).trigger('change');
        $('#org12').val($scope.info.org1).trigger('change');
        $('#org22').val($scope.info.org2).trigger('change');
        $('#org32').val($scope.info.org3).trigger('change');
        $('#cont12').val($scope.info.cont1).trigger('change');
        $('#cont22').val($scope.info.cont2).trigger('change');
        $('#cont32').val($scope.info.cont3).trigger('change');
        $('#event2').val($scope.info.eventname).trigger('change');
        $('#duration2').val($scope.info.duration).trigger('change');
        $('#team2').val($scope.info.team).trigger('change');
        $('#bud2').val($scope.info.bud).trigger('change');
        $('#vol2').val($scope.info.vol).trigger('change');
        $('#items2').val($scope.info.items).trigger('change');
        $('#desc2').val($scope.info.desc).trigger('change');

        $('#remark').val($scope.info.remark).trigger('change');

        
      };

//admin side update
  $scope.updateadmin = function(){
    console.log($scope.user);
    $http.post('api/admin/update',$scope.user).then(function(response){
      console.log(response);
      $scope.message = response.data;
      $scope.user= {};
     
      
    });
  };


 function viewoneall()
  {
    $('#editpanel').hide();
    $('#view1').show();
    $('#view2').hide();
    $('#viewvol').hide();
    $('#editvol').hide();
     $('#viewall').hide();
  };


 function viewtwoall()
  {
    $('#editpanel').hide();
    $('#view1').hide();
    $('#view2').show();
    $('#viewvol').hide();
    $('#editvol').hide();
     $('#viewall').hide();
  };

 function viewall()
  {
    $('#editpanel').hide();
    $('#view1').hide();
    $('#view2').hide();
    $('#viewvol').hide();
    $('#editvol').hide();
    $('#viewall').show();
  };


  //admin delete
  $scope.del =function(user)
  { 
    var user = { email : user.email };
    user= JSON.stringify(user);
    console.log(user);
    $http.post('api/admin/delete',user).then(function(response){
      console.log(response.data);
      $scope.deletemess = response.data;


    });
  }
function viewvolall(){
  $('#viewvol').show();
  $('#editpanel').hide();
    $('#view1').hide();
    $('#view2').hide();
     $('#viewall').hide();
    $('#editvol').hide();
};

//Volunteer Load
$scope.findvol = function(){

    $http.post('api/admin/findvol').then(function(res){
                      console.log("working");
                      var alldatav={};
                       $scope.alldatav= res.data;
                     viewvolall();
                   }),function(){
                    console.log("error");
                   };
};

//  Volunteer edit 
$scope.editvol = function(vol){
  $('#editvol').show();
  $('#editpanel').hide();
      $('#view1').hide();
      $('#view2').hide();
      $('#viewvol').hide();
       $('#viewall').hide();
      
        $scope.info = vol.volunteer;
        $scope.data= vol;
        //Set value of edit form
        
        $('#namev').val($scope.info.name).trigger('change');
        $('#emailv').val($scope.data.email).trigger('change');
        $('#contactv').val($scope.info.contact).trigger('change');
        $('#branchv').val($scope.info.branch).trigger('change');
        $('#yearv').val($scope.info.year).trigger('change');
        $('#dutyv').val($scope.info.duty).trigger('change');
          $('#ieeev').val($scope.info.ieee).trigger('change');
     //    $('#reasonv').val($scope.info.reason).trigger('change');
       

};
//Update Volunteer
$scope.volupdate = function(){
  console.log($scope.user)
  $http.post('api/admin/volupdate',$scope.user).then(function(response){
    console.log("Updated");
    $scope.message = response.data;
  });
};





// ---------- VOLUNTEER SIDE -------------------------

//Volunteer Submit
$scope.volsub = function(){

    $http.post('api/volunteer/data',$scope.user).then(function(response){
      console.log(response.data);
      $scope.message = response.data;
    });

};

//Volunteer Load 
$scope.loadpro = function(){
     var user ={ email: $cookies.get('username')};
        user = JSON.stringify(user);
      console.log(user);
   
      //$('#voledit').hide();
       $http.post('api/volunteer/loadpro',user).then(function(res)
                    {      $('#formvol').hide();
                            $('#volt').show();
                            $('#editvol').hide();
                      
                          console.log(res);
                          $scope.inf= res.data;
                          console.log(res.data.volunteer.name);
                           
                         // $('.userform').attr("readonly", true);
                        
                    });
      };
$scope.editvvol  = function()
{
              $('#formvol').hide();
              $('#volt').hide();
              $('#editvol').show();
              
         var user =  $cookies.get('username');
        $('#namee').val($scope.inf.volunteer.name).trigger('change');
        $('#emaile').val(user).trigger('change');
        $('#contacte').val($scope.inf.volunteer.contact).trigger('change');
        $('#branche').val($scope.inf.volunteer.branch).trigger('change');
        $('#yeare').val($scope.inf.volunteer.year).trigger('change');
        $('#reasone').val($scope.inf.volunteer.reason).trigger('change');
         $('#ieee').val($scope.inf.volunteer.ieee).trigger('change');



};


$scope.updatevol = function()
{
  console.log($scope.user);
  $http.post('api/volunteer/update',$scope.user).then(function(res){
      $scope.message = res.data;
  });
  $scope.message='';
};

$scope.alert= function(){

  alert('Your acoount is verified');
};

}]);


