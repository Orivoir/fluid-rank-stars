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
        // autoResponsive: true ,
        size: 45 , // default 42px

        // Optional but warning after valid rank
        onValid: function( data ) {

            console.log( 'you have valid an rank , data : '  , data );
        } ,

        onChange: function( data ) {

            console.log( 'you have change on : '  ,data )
        }
    }) ;

} ) ;