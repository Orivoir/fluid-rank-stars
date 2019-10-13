/**
 * fluid-rank-stars dev file 
 *
 * <@author sam.gabor@hotmail.com>
 * git profil [https://github.com/Orivoir]
 * git repositorie [https://github.com/Orivoir/fluid-rank-stars/]
 * homepage [https://orivoir.github.io/profil-reactjs]
 * 
 * write with <3 && JavaScript ;
 */

"use strict"; // 😎 

/**
 * @description config and initialize fluid rank system
 * @param {Object} param0 
 * @returns {Number|Null} value of contains number execute
 */
const fluidRankInit = ({
    background ,
    size ,
    onValid ,
    onChange ,
    flex ,
    autoResponsive
}) => {

    if( !document || !window ) {
        throw `wrong you have called fluidRank function before load DOM`;
    }

    const contains = document.querySelectorAll('.contain-fluid-rank') ;

    if( !contains || !contains.length ) {
        console.warn(`you have call the fluidRank initialize function but you have dont define contain in the DOM`);
    }

    /**
     * define config property of fluidRank
     * save in the property window object 
     */
    window.initRankProperties( {
        background , size , onValid , flex , autoResponsive , onChange
    } ) ;

    if( !contains || !contains.length )
        return ; // manually exec window.fluidRank( contains: Node ): void , becauze you have dont define a container in the DOM

    /**
     * exec the system fluid rank for all contains
     */
    [...contains].map( contain => (
        window.fluidRank( contain )
    ) ) ;

    /**
     * on exit contains
     */
    document.addEventListener('mousemove' , onDocumentMove ) ;


    return contains.length ;
}

const onDocumentMove = e => {

    if( !window.fluidRankProperties.contains || !window.fluidRankProperties.contains.length )
        return ; // dont contains define
    
    window.fluidRankProperties.contains.map( contain => {

        if( contain.fluidRankState.isRanked )
            return ; /* user already valid this rank */
            
        const coo = { x: e.clientX || e.pageX , y: e.pageY || e.clientY } ;

        if(
            coo.x >= contain.offsetLeft && coo.x <= contain.offsetLeft + contain.offsetWidth &&
            coo.y >= contain.offsetTop && coo.y <= contain.offsetTop + contain.offsetHeight
        )
            return ; /* mouse is in this contain */

        [...contain.fluidRankState.stars].map( star => star.style.background = window.fluidRankProperties.background[0] ) ;
        contain.fluidRankState.all = 0;
        contain.fluidRankState.parital = 0;
    } ) ;

} ;

( w => {

    /**
     * @description define system fluid rank for one contain
     * @param {Node} contain 
     */
    w.fluidRank = function( contain ) {

        if( !( contain instanceof Node ) ) {

            console.warn('arg1 give to window.fluidRank must be an Node but is a ' , typeof contain );
            return ;
        }

        if( !window.fluidRankProperties )
            throw `you have dont called the initializer function fluidRankInit( config: Object )`;

        if( !window.fluidRankProperties.contains )
            window.fluidRankProperties.contains = [] ;

        this.window.fluidRankProperties.contains.push( contain ) ;

        contain.fluidRankState = {

            currentOpened: {
                /* status rank current */
                all: 0 ,
                partial: 0
            } ,
            rank: null,
            isRanked: false , /* status valid rank*/
            stars: contain.querySelectorAll( '.item-fluid-rank' ) ,
            
            onActiveStars: function() {

                if( this.isRanked )
                    return ; /* user already valid this rank */

                [...this.stars].map( star => {

                    const _this = this ;

                    star.addEventListener('mousemove' , function( e ) {

                        if( _this.isRanked )
                            return ; /* user have already valid ranked */

                        const
                            runLenght = (e.clientX || e.pageX ) - this.offsetLeft ,
                            pct = parseFloat(( runLenght / this.offsetWidth ) * 100).toFixed(1) ,
                            key = parseInt( this.getAttribute('data-key') )
                        ;

                        // resolve items alternate
                        window.fluidRankResolveItems( contain , key );

                        const lastOpened = _this.currentOpened ;

                        _this.currentOpened.all = key ; // number stars full mouseover
                        this.style.background = `linear-gradient(.25turn , ${window.fluidRankProperties.background[1]} ${pct}%, ${window.fluidRankProperties.background[0]} ${100-pct}% )` ;
                        _this.currentOpened.partial = pct;
                                
                        /**
                         * stabilize out point of linear gradient;
                         */
                        if( pct >= 85 ) {

                            this.style.background =  window.fluidRankProperties.background[1] ;                
                            _this.currentOpened.partial = 0;
                            _this.currentOpened.all++ ;

                        } else if( pct <= 15 ) {
                            
                            this.style.background = window.fluidRankProperties.background[0] ;
                            _this.currentOpened.partial = 0;
                            _this.currentOpened.all--;
                        }

                        if( _this.currentOpened.all < 0 ) // protect integrity
                            _this.currentOpened.all = 0;

                        if( lastOpened.all === _this.currentOpened.all || lastOpened.partial === _this.currentOpened.partial ) {
                            
                            const rank = window.getCurrentFluidRank( _this.currentOpened ) ;
                            
                            window.fluidRankProperties.onChange(
                                {
                                    rank: rank,
                                    contain: contain ,
                                    stars: contain.fluidRankState.stars 
                                }
                            );
                        }

                    } ) ;

                } ) ;
            } ,

            onValidRank: function() {

                const _this = this ;
                
                contain.addEventListener('click' , () => {

                    if( _this.isRanked ) return ; /* user already valid this rank */

                    const rank = window.getCurrentFluidRank( _this.currentOpened ) ;

                    if( typeof rank === 'number' && !isNaN( rank ) ) {
                        _this.isRanked = true ;
                        _this.rank = rank ;
                    }

                    contain.classList.add('valid');

                    window.fluidRankProperties.onValid(
                        {
                            rank: rank ,
                            contain: contain ,
                            stars: contain.fluidRankState.stars
                        }
                    );                    

                } ) ;
            }
        } ;

        if( !contain.fluidRankState.stars || !contain.fluidRankState.stars.length ) {
            
            const items = parseInt( contain.getAttribute('data-item-number-fluid-rank') ) ;

            if( !items || isNaN( items ) ) { // items of contains dont exists

                delete contain.fluidRankState ;
                console.warn('window.fluidRank , your contain' , contain , ' dont have item define him is abondoned' );
                return ;

            } else { // number of items is give by an data-attr 

                // inject dont semantical items 
                Array.from( Array( isNaN( items ) ? 5 : items ).keys() ).map( key => {
                    const div = document.createElement('div');
                    
                    div.className = 'item-fluid-rank';
                    contain.appendChild( div );
                }) ;

                // finally init stars state
                contain.fluidRankState.stars = contain.querySelectorAll('.item-fluid-rank');
            }
        }

        const size = window.fluidRankProperties.size ;

        [...contain.querySelectorAll('.item-fluid-rank')].map( (star,key) => {
            star.style.background = window.fluidRankProperties.background[0] // default background define ;
            star.style.width = typeof size === 'number' ? size + 'px' : size ;   
            star.style.height = typeof size === 'number' ? size + 'px' : size ;
            star.setAttribute('data-key' , key );
        }) ;

        if( window.fluidRankProperties.flex )
            contain.classList.add('flex');

        contain.fluidRankState.onActiveStars();
        contain.fluidRankState.onValidRank();

        if( window.fluidRankProperties.autoResponsive )
            contain.classList.add('auto-responsive');
    } ,

    w.initRankProperties = function( properties ) {

        this.window.fluidRankProperties = {
            onValid: properties.onValid instanceof Function ?
                properties.onValid :
                () => console.warn('you have dont define a callback after valid rank fluidRank give an onValid param with a callback') ,
            size:   typeof properties.size === 'string' ||
                    typeof properties.size === 'number' &&
                    !isNaN( properties.size ) ? 
                properties.size: 42 ,
            flex: ( typeof properties.flex === 'string' && /$f(lex)?^/i.test( properties.flex.trim() ) ) || properties.flex ? true: false ,
            autoResponsive: properties.autoResponsive ? true: false ,
            background: typeof properties.background === 'object' && (
                Object.keys( properties.background )
                    .filter( property => (
                        ['default' , 'active' ].includes( property ) && typeof properties.background[ property ]
                    )
                ).length === 2 ? [ background.default , background.active ] : [ 'rgb(192,192,192)' , '#7e701f' ]
            ) ,
            onChange: properties.onChange instanceof Function ?
                properties.onChange :
                () => {/* silence is <feature /> */}
        } ;
    } ,

    w.fluidRankResolveItems = function( contain , key ) {

        /**
         * active before star.s
         */
        Array.from( Array( (key) ).keys() ).map( key => (
            contain.querySelector(`.item-fluid-rank[data-key="${key}"]`).style.background = window.fluidRankProperties.background[1] 
        ) ) ;
                
        /**
         * down after star.s
         */
        Array.from( Array( ( contain.fluidRankState.stars.length -key) ).keys() , x=> x+key ).map( key => (
            contain.querySelector(`.item-fluid-rank[data-key="${key}"]`).style.background = window.fluidRankProperties.background[0] 
        ) ) ;
    } ,

    w.getCurrentFluidRank = function( currentOpened ) {

        return ( currentOpened.all + ( ( parseInt( currentOpened.partial ) / 100 ) ) ) ;
    }

} )( window ) ;
