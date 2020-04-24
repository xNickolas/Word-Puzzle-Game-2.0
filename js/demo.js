// ----------------------------------------------------------------------------
// All right reserved
// Copyright (C) 2012 Garmd Motion Code
// http://www.garmd.com/
// ----------------------------------------------------------------------------
// Yes, we make magic!
// ----------------------------------------------------------------------------

// s -> t and c -> v

buzz.defaults.formats = [ 'ogg', 'mp3' ];
buzz.defaults.preload = 'metadata';

var games = [
    { img: 'img/frog.png', color:'#32cd32', word: 'frog', sound: 'sounds/frog' }, //<-
    { img: 'img/1-koala2.png', color:'#176580', word: 'koala', sound: '' }, //<-
    { img: 'img/2-croc.png', color:'#d5ea86', word: 'crocodile', sound: 'sounds/croc' }, //<-
    { img: 'img/3-monkey2.png', color:'#ffc48b', word: 'monkey', sound: 'sounds/monkey' }, //<-
    { img: 'img/4-panda.png', color:'#dcdcdc', word: 'panda', sound: '' }, //<-
    { img: 'img/5-pig.png', color:'#ffa07a', word: 'pig', sound: 'sounds/pig' }, //<-
    { img: 'img/6-cat.png', color:'#363636', word: 'cat', sound: 'sounds/meow' }, //<-
    { img: 'img/7-elephant2.png', color:'#a9a9a9', word: 'elephant', sound: 'sounds/elephant2' }, //<-
    { img: 'img/8-rabbit2.png', color:'#f5deb3', word: 'rabbit', sound: '' }, //<-
    { img: 'img/bear.png', color:'#807148', word: 'bear', sound: 'sounds/bear' },
    { img: 'img/horse.png', color:'#bc9e6c', word: 'horse', sound: 'sounds/horse' },
    { img: 'img/bull.png', color:'#ff5f09', word: 'bull', sound: 'sounds/bull' },
    { img: 'img/tiger.png', color:'#b3eef4', word: 'tiger', sound: 'sounds/lion' },
    { img: 'img/turtle.png', color:'#d5ea86', word: 'turtle', sound: '' },
    { img: 'img/lion1.png', color:'#dd992d', word: 'lion', sound: 'sounds/lion' },
    { img: 'images/bee.png', color:'#C19850', word: 'bee', sound: 'sounds/bee' },
    { img: 'images/skunk_walk_01.png', color:'#7986AA', word: 'skunk', sound: '' },
    { img: 'images/ant.png', color:'#BCC9BB', word: 'ant', sound: '' },
    { img: 'images/icon_ladybug.png', color:'#AA86AA', word: 'ladybug', sound: '' },
    { img: 'images/icon_penguinjump.png', color:'#8688A8', word: 'penguin', sound: '' },
    
];

var winSound        = new buzz.sound('sounds/levelWin' ),
    errorSound      = new buzz.sound('sounds/error' ),
    alphabetSounds  = {},
    alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

for (let letterIndex in alphabet) {
    alphabetSounds[alphabet[letterIndex]] = new buzz.sound('sounds/kid/' + alphabet[letterIndex]);
}

$( function() {
    if ( !buzz.isSupported() ) {
        $('#warning').show();
    }

    var idx = 0,
        $container  = $( '#container' ),
        $picture    = $( '#picture' ),
        $models     = $( '#models' ),
        $letters    = $( '#letters' );

    $( 'body' ).bind('selectstart', function() { 
        return false 
    });

    $( '#next' ).click( function() {
        refreshGame();
        buildGame( ++idx ); 
        return false;
    });

    $( '#previous' ).click( function() {
       refreshGame();
       buildGame( --idx ); 
       return false;
    });

    $('#select-options').change(function () {
        levelDifficulty();
        return false;
    });

    function levelDifficulty() {
        let select = document.querySelector('select');
        let option = select.children[select.selectedIndex];
        let text = option.textContent;
        switch (text) {
            case 'Easy':
                setEasyDifficulty();
                break;
            case 'Medium':
                setMediumDifficulty();
                break
            case 'Hard':
                setHardDifficulty();
                break

            default:
                break;
        }
    }

    function setEasyDifficulty() {
        $models.find('li').each(function (i) {
            $(this).css({
                color: 'rgba(0, 0, 0, 0.7)'
            });
        });
    }

    function setMediumDifficulty() {
        $models.find('li').each(function (i) {
            if (i % 3 == 0) {
                $(this).css({
                    color: 'rgba(0, 0, 0, 0.7)'
                });
            } else {
                $(this).css({
                    color: 'transparent'
                });
            }
        });
    }

    function setHardDifficulty() {
        $models.find('li').each(function (i) {
            $(this).css({
                color: 'transparent'
            });
        });
    }

    function refreshGame() {
        $( '#models' ).html( '' );
        $( '#letters' ).html( '' );
    }

    function buildGame( x ) {
        if ( x > games.length - 1 ) {
            idx = 0;
        }
        if ( x < 0 ) {
            idx = games.length - 1;
        }

        var game  = games[ idx ],
            score = 0;

        var gameSound = new buzz.sound( game.sound );
        gameSound.play();

        // Fade the background color
        $( 'body' ).stop().animate({
            backgroundColor: game.color
        }, 1000);
        $( '#header a' ).stop().animate({
            color: game.color
        }, 1000);

        // Update the picture
        $picture.attr( 'src', game.img )
            .unbind( 'click' )
            .bind( 'click', function() {
                gameSound.play();
            });
        
        // Build model
        var modelLetters = game.word.split( '' );

        for( let i in modelLetters ) {
            let letter = modelLetters[ i ];
            // build li html components (letters in the right position inside the ghost cards)
            $models.append( '<li>' + letter + '</li>' );
        }

        var letterWidth = $models.find( 'li' ).outerWidth( true );

        $models.width( letterWidth * $models.find( 'li' ).length );

        // setAnimation($models, 'shown');

        // Build shuffled letters
        var letters  = game.word.split( '' ),
            shuffled = letters.sort( function() { return Math.random() < 0.5 ? -1 : 1 });

        for( let i in shuffled ) {
            $letters.append( '<li class="draggable">' + shuffled[ i ] + '</li>' );
        }

        // positon and angle of the letters cards 
        $letters.find( 'li' ).each( function( i ) {
            var top   = ( $models.position().top ) + ( Math.random() * 100 ) + 60 + 355,
                left  = ( $models.offset().left - $container.offset().left ) + ( Math.random() * 20 ) + ( i * letterWidth ),
                angle = ( Math.random() * 30 ) - 10;

            $( this ).css({
                top:  top  + 'px',
                left: left + 'px'
            });

            rotate( this, angle );

            $( this ).mousedown( function() {
                let letter = $( this ).text();
                if ( alphabetSounds[ letter ] ) {
                    alphabetSounds[ letter ].play();
                }
            });
        });

        $letters.find( 'li.draggable' ).draggable({
            zIndex: 9999,
            stack: '#letters li'
        });

        // called here to initially begin on the state set in HTML selected option
        levelDifficulty();

        $models.find( 'li' ).droppable( {
            accept:     '.draggable',
            hoverClass: 'hover',
            drop: function( e, ui ) {
                var modelLetter      = $( this ).text(),
                    droppedLetter = ui.helper.text();
                console.log("o valor de this é:", $(this).position);
                if ( modelLetter == droppedLetter ) {
                    ui.draggable.animate( {
                        top:  $( this ).position().top,
                        left: $( this ).position().left
                    } ).removeClass( 'draggable' ).draggable( 'option', 'disabled', true );
                    
                    rotate( ui.draggable, 0 );
                    
                    score++;
                    
                    if ( score == modelLetters.length ) {
                        winGame();
                    }    
                } else {
                    ui.draggable.draggable( 'option', 'revert', true );
                    
                    errorSound.play();
                    
                    setTimeout( function() {
                        ui.draggable.draggable( 'option', 'revert', false );
                    }, 100 );
                }
            }
        });
    }

    function winGame() {
        winSound.play();

        $( '#letters li' ).each( function( i ) {
            var $$ = $( this );
            setTimeout( function() {
                $$.animate({
                    top:'+=60px'
                });
            }, i * 300 );
        });

        setTimeout( function() {
            refreshGame();
            buildGame( ++idx );
        }, 3000);
    }

    function rotate( el, angle ) {
        $( el ).css({
            '-webkit-transform': 'rotate(' + angle + 'deg)',
            '-moz-transform': 'rotate(' + angle + 'deg)',
            '-ms-transform': 'rotate(' + angle + 'deg)',
            '-o-transform': 'rotate(' + angle + 'deg)',
            'transform': 'rotate(' + angle + 'deg)'
        });
    }

    function setAnimation($elmt, className, remove) {
        $elmt.classList.remove(className);
        $elmt.offsetHeight;
        $elmt.classList.add(className);

        if (remove) {
            $elmt.addEventListener("animationend", function () {
                $elmt.classList.remove(className);
            });

            $elmt.addEventListener("transitionend", function () {
                $elmt.classList.remove(className);
            });
        }
    }

    buildGame( idx );
});