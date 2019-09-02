/*
* user used syntax && called
*/
document.addEventListener('DOMContentLoaded' , () => {

    fluidRankInit({
        background: {
            // optional
            // default: "silver" ,
            // active: "red"
         } ,
        flex: true ,
        autoResponsive: true ,
        // size: 50 ,

        // Optional but warning after valid rank
        onValid: function( data ) {

            console.log( 'you have valid an rank , data : '  , data );
        }
    }) ;

} ) ;