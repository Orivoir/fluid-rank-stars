Node.prototype.on = Node.prototype.addEventListener ; 

( d => (

    /**
     * first script fluid rank factory
     * warn this script is not integrable
     * this is first prototype
     */

    d.addEventListener( 'DOMContentLoaded' , () => {
            
        d.sel = d.querySelector ;
        d.selAll = d.querySelectorAll ;

        const
            stars = [ ...( d.selAll('li.star') ) ] ,
            wrapStar = d.sel( 'ul.wrap-star' ) ,
            currentOpened = {
                all: 0 ,
                partial: 0
            }
        ;
        let isRanked = false
            
        wrapStar.on('click' , () => {

            if( isRanked ) return ; /* already valid rank */

            const on5 = currentOpened.all + ((parseInt(currentOpened.partial) / 100)) ;

            if( typeof on5 === 'number' && !isNaN( on5 ) ) {
                isRanked = on5 ;
            }

            wrapStar.classList.add('valid')

        } ) ;

        document.on('mousemove' , e => {

            if( isRanked ) return ; /* already valid rank */

            const coo = { x: e.clientX || e.pageX , y: e.pageY || e.clientY } ;

            if(
                coo.x >= wrapStar.offsetLeft && coo.x <= wrapStar.offsetLeft + wrapStar.offsetWidth &&
                coo.y >= wrapStar.offsetTop && coo.y <= wrapStar.offsetTop + wrapStar.offsetHeight
            )

                return;

            stars.map( star => star.style.background = 'rgb(192,192,192)' ) ;

            currentOpened.all = 0;
            currentOpened.partial = 0;
        } ) ;

        stars.map( star => {

            star.on('mousemove' , function(e) {

                if( isRanked ) return ; /* already valid rank */

                const
                    runInner = (e.clientX || e.pageX ) - this.offsetLeft ,
                    pct = parseFloat(( runInner / this.offsetWidth ) * 100).toFixed(1) ,
                    key = parseInt( this.getAttribute('data-key') )
                ;

                /**
                 * active before star.s
                 */
                Array.from( Array( (key) ).keys() ).map( key => (
                    d.sel(`ul li.star[data-key="${key}"]`).style.background = "#daa520" 
                ) ) ;

                /**
                 * down after star.s
                 */
                Array.from( Array( (5-key) ).keys() , x=> x+key ).map( key => (
                    d.sel(`ul li.star[data-key="${key}"]`).style.background = "rgb(192,192,192)" 
                ) ) ;

                currentOpened.all = key ;

                this.style.background = `linear-gradient(.25turn , #daa520 ${pct}%, rgb( 192,192,192 ) ${100-pct}% )` ;

                currentOpened.partial = pct;

                /**
                 * stabilize out point of linear gradient;
                 */
                if( pct >= 72 ) {

                    this.style.background = '#daa520';                
                    currentOpened.partial = 0;
                    currentOpened.all++ ;


                } else if( pct <= 22 ) {
                    
                    this.style.background = 'rgb( 192,192,192 )';
                    currentOpened.partial = 0;
                    currentOpened.all--;
                }

            }  ) ;

        } ) ;

    } )

) )( document ) ;