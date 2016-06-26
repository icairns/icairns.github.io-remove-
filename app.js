var main = function() {
    
    /*Change which discription is showing or don't show one at all  */
    $('.item').click(function() {
                        
                        if($(this).hasClass('current')){
                           $(this).toggleClass('current')
                           $(this).siblings().hide();
                        }else{
                           $('.item').removeClass('current');
                           $('.description').hide();
                        
                           $(this).addClass('current');
                           $(this).siblings().show();
                           }
                        });
    
    
    /* not working right. It should index through the current tab*/
    $(document).keypress(function(event) {
                         if(event.which === 111) {
                         $('.description').hide();
                         
                         $('.current').children('.description').show();
                         }
                         
                         else if(event.which === 110) {
                         var currentArticle = $('.current');
                         var nextArticle = currentArticle.next();
                         
                         currentArticle.removeClass('current');
                         nextArticle.addClass('current');
                         }
                         });
    
    var i=0;
    $('#tab').click(function(){
                    
                    if(i===0){
                                        $('#filter').animate({left:'17%'},500);
                    i=1;
                    }else{
                   
                                        $('#filter').animate({left:'0%'},500);
                    i=0;
                    }
                    
                    });
    $('.greyout').hover(function(){
                    $(this).css("background-color","grey");
                    },
                    function(){
                    $(this).css("background-color","white");
                    });
    
    
    $('#menulist').hide();
    $('#menu').click(function(){
                     
                     $('#menulist').toggle();
                     });
    $('.slidecontent').hide();
    $('.active-slide').show();
    $('#next').click(function(){
                             var currentSlide=$('.active-slide');
                             var nextSlide=currentSlide.next();
                             if (nextSlide.length===0){
                                nextSlide=$('.slidecontent').first();
                            }
                             currentSlide.hide().removeClass('active-slide');
                             nextSlide.show().addClass('active-slide');
                             });
    $('#prev').click(function(){
                     var currentSlide=$('.active-slide');
                     var prevSlide=currentSlide.prev();
                     if(prevSlide.length===0){
                        prevSlide=$('.slidecontent').last();
                     }
                     currentSlide.hide().removeClass('active-slide');
                     prevSlide.show().addClass('active-slide');
                     
                     });
    $('.hotproductsimg').hover(function(){
                               $(this).css("height","100%")},
                               function(){
                               $(this).css("height","90%")}
                              
                              );
    $('#ClcButton').click(function(){
                          var a=$('#num1').val();
                          var b=$('#num2').val();
                          var c=addition(a,b);
                          $('#ans').empty().append(c);
                          });
    
    
    var addition=function(v,n){
        return parseInt(v)+parseInt(n);
    };
    
}

$(document).ready(main);