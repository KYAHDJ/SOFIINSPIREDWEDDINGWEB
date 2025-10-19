gsap.registerPlugin(ScrollTrigger);

// Global variables
let masterTimeline;
let canSkipSplash = false;
let isMenuOpen = false;

// Animation state variables
let scrollProgress = 0;
let isAnimating = false;
let currentSection = 'hero';
let canChangeSection = true;
let brideScrollProgress = 0;
let isOurBigDayScrollable = false;
let isScrollingOurBigDay = false;

// DOM elements (will be initialized in initMainAnimation)
let blackScreenCurved, heroSection, groomSection, brideSection, ourBigDaySection, heroContent;

// Main initialization
window.addEventListener('load', function() {
    console.log('🎬 Starting cinematic splash sequence...');

    const splash = document.getElementById('splash');
    const topPanel = document.querySelector('.black-panel.top');
    const bottomPanel = document.querySelector('.black-panel.bottom');
    const audio = document.getElementById('intro-audio');
    const mainContent = document.querySelector('.main-content');

    // Make sure splash is visible initially with black panels
    splash.style.display = 'flex';
    mainContent.style.opacity = '0';
    mainContent.style.visibility = 'hidden';

    // Create main GSAP timeline for splash
    masterTimeline = gsap.timeline({
        onComplete: function() {
            console.log('✅ Splash screen complete, showing main website...');
            showMainWebsite();
        }
    });

    // CINEMATIC OPENING: Black panels split (top goes up, bottom goes down)
    masterTimeline
        .set(splash, { background: '#000' })
        .to(topPanel, {
            y: '-100%',
            duration: 1.2,
            ease: "power2.inOut"
        }, 0.5)
        .to(bottomPanel, {
            y: '100%',
            duration: 1.2,
            ease: "power2.inOut"
        }, 0.5)
        .to(splash, {
            background: 'linear-gradient(135deg, #f9dce5, #fce9ef)',
            duration: 0.8
        }, 1);

    // Start background music after the cinematic opening
    masterTimeline.call(function() {
        if (audio) {
            audio.volume = 0.3;
            audio.muted = false;
            audio.play().catch(e => console.log('Audio play failed:', e));
        }
        // Enable skip after cinematic opening
        canSkipSplash = true;
    });

    // SPLASH SCREEN ANIMATIONS (letters)
    const msg1Letters = document.querySelectorAll('#splash-msg-1 .splash-letter');
    masterTimeline
        .set('#splash-msg-1', { opacity: 1 })
        .fromTo(msg1Letters, {
            opacity: 0,
            y: -100,
            rotation: -20
        }, {
            opacity: 1,
            y: 0,
            rotation: 0,
            duration: 0.8,
            stagger: {
                each: 0.08,
                from: "random",
                ease: "back.out(1.7)"
            }
        }, "+=0.5")
        .to(msg1Letters, {
            y: -80,
            opacity: 0,
            rotation: -15,
            duration: 0.6,
            stagger: {
                each: 0.05,
                from: "end",
                ease: "power2.in"
            }
        }, "+=1.2");

    const msg2Letters = document.querySelectorAll('#splash-msg-2 .splash-letter');
    masterTimeline
        .set('#splash-msg-2', { opacity: 1 })
        .fromTo(msg2Letters, {
            opacity: 0,
            x: function() { return gsap.utils.random(-120, 120); },
            y: function() { return gsap.utils.random(-20, 20); },
            rotation: function() { return gsap.utils.random(-25, 25); }
        }, {
            opacity: 1,
            x: 0,
            y: 0,
            rotation: 0,
            duration: 1,
            stagger: {
                each: 0.07,
                from: "center",
                ease: "elastic.out(1, 0.5)"
            }
        })
        .to(msg2Letters, {
            y: 60,
            opacity: 0,
            rotation: function() { return gsap.utils.random(-15, 15); },
            duration: 0.7,
            stagger: {
                each: 0.04,
                from: "edges",
                ease: "power2.in"
            }
        }, "+=1.2");

    const msg3Letters = document.querySelectorAll('#splash-msg-3 .splash-letter');
    const msg3Heart = document.querySelector('#splash-msg-3 .heart-emoji');

    masterTimeline
        .set('#splash-msg-3', { opacity: 1 })
        .fromTo(msg3Letters, {
            opacity: 0,
            scale: 0,
            y: 60
        }, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.9,
            stagger: {
                each: 0.06,
                from: "start",
                ease: "bounce.out"
            }
        })
        .fromTo(msg3Heart, {
            opacity: 0,
            scale: 0,
            rotation: -180
        }, {
            opacity: 1,
            scale: 1.5,
            rotation: 0,
            duration: 1.2,
            ease: "elastic.out(1.2, 0.5)"
        }, "-=0.3")
        .to(msg3Heart, {
            scale: 1,
            duration: 0.4,
            ease: "power2.out"
        })
        .to([...msg3Letters, msg3Heart], {
            y: -80,
            opacity: 0,
            rotation: 12,
            duration: 0.8,
            stagger: {
                each: 0.03,
                from: "random",
                ease: "power2.in"
            }
        }, "+=1.8");

    // Spacebar to skip splash screen
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' && canSkipSplash) {
            e.preventDefault();
            skipSplashScreen();
        }
    });

    // Click to skip
    splash.addEventListener('click', function() {
        if (canSkipSplash) {
            skipSplashScreen();
        }
    });
});

// Skip splash screen function
function skipSplashScreen() {
    if (!canSkipSplash) return;
    
    console.log('⏭️ Skipping splash screen...');
    canSkipSplash = false;
    
    // Kill the master timeline
    if (masterTimeline) {
        masterTimeline.kill();
    }
    
    // Hide splash immediately with fade
    const splash = document.getElementById('splash');
    gsap.to(splash, {
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut",
        onComplete: function() {
            splash.style.display = 'none';
            showMainWebsite();
        }
    });
}

// Show main website function with PROPER FADE
function showMainWebsite() {
    const mainContent = document.querySelector('.main-content');
    const splash = document.getElementById('splash');
    
    // PROPER FADE IN MAIN CONTENT - 3 seconds smooth transition
    gsap.to(mainContent, {
        opacity: 1,
        duration: 3,
        ease: "power2.inOut",
        onStart: function() {
            mainContent.style.visibility = 'visible';
        },
        onComplete: function() {
            // Hide splash after main content is visible
            splash.style.display = 'none';
            document.documentElement.classList.remove('intro-active');
            document.body.classList.remove('intro-active');
            
            // Initialize wheel-controlled animation
            initMainAnimation();
            // Initialize burger menu
            initBurgerMenu();

            console.log('🏡 Main website fully revealed!');
        }
    });

    // FADE OUT SPLASH simultaneously
    gsap.to(splash, {
        opacity: 0,
        duration: 2.5,
        ease: "power2.inOut"
    });
}

// Countdown timer function
function initCountdown() {
    const weddingDate = new Date('February 17, 2026 00:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update the countdown elements
        document.querySelector('[data-days] .countdown-number').textContent = days;
        document.querySelector('[data-hours] .countdown-number').textContent = hours;
        document.querySelector('[data-minutes] .countdown-number').textContent = minutes;
        document.querySelector('[data-seconds] .countdown-number').textContent = seconds;
        
        // If the countdown is over
        if (distance < 0) {
            clearInterval(countdownInterval);
            document.querySelector('[data-days] .countdown-number').textContent = '0';
            document.querySelector('[data-hours] .countdown-number').textContent = '0';
            document.querySelector('[data-minutes] .countdown-number').textContent = '0';
            document.querySelector('[data-seconds] .countdown-number').textContent = '0';
        }
    }
    
    // Update immediately and then every second
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
}

// Burger Menu functionality
function initBurgerMenu() {
    const burgerIcon = document.querySelector('.burger-icon');
    const navSidebar = document.querySelector('.nav-sidebar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle menu
    burgerIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });
    
    // Close menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            navigateToSection(targetSection);
            closeMenu();
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (isMenuOpen && !navSidebar.contains(e.target) && !burgerIcon.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });
}

function toggleMenu() {
    const burgerIcon = document.querySelector('.burger-icon');
    const navSidebar = document.querySelector('.nav-sidebar');
    
    if (!isMenuOpen) {
        // Open menu
        burgerIcon.classList.add('active');
        navSidebar.classList.add('active');
        isMenuOpen = true;
        
        // Animate menu items
        gsap.fromTo('.nav-link', 
            { x: 50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "back.out(1.7)" }
        );
    } else {
        closeMenu();
    }
}

function closeMenu() {
    const burgerIcon = document.querySelector('.burger-icon');
    const navSidebar = document.querySelector('.nav-sidebar');
    
    burgerIcon.classList.remove('active');
    navSidebar.classList.remove('active');
    isMenuOpen = false;
}

// Navigation function with PROPER ANIMATIONS
function navigateToSection(section) {
    if (!canChangeSection) return;
    canChangeSection = false;
    
    console.log(`📍 Navigating to: ${section} with animations`);
    
    // Reset all animation states PROPERLY
    currentSection = section;
    isAnimating = true;
    brideScrollProgress = 0;
    isOurBigDayScrollable = false;
    isScrollingOurBigDay = false;
    
    // Create a timeline for the navigation animation
    const navTimeline = gsap.timeline({
        onComplete: function() {
            canChangeSection = true;
            isAnimating = false;
            console.log(`✅ Navigation to ${section} complete`);
        }
    });
    
    // Handle each section transition with proper animations
    switch(section) {
        case 'hero':
            // Fade out current sections
            navTimeline
                .to([groomSection, brideSection, ourBigDaySection], {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.inOut"
                })
                // Reset positions
                .set([groomSection, brideSection, ourBigDaySection], {
                    visibility: 'hidden',
                    y: '0vh'
                }, "-=0.8")
                .set(ourBigDaySection, { y: '100vh' }, "-=0.8")
                // Show hero
                .set(heroContent, { opacity: 1 })
                .to(blackScreenCurved, {
                    height: "0%",
                    borderRadius: "50% 50% 0 0",
                    backgroundColor: "#000",
                    duration: 1.2,
                    ease: "power3.out"
                });
            scrollProgress = 0;
            break;
            
        case 'groom':
            // Hide other sections and show groom with animation
            navTimeline
                .to([heroContent, brideSection, ourBigDaySection], {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.inOut"
                })
                .set([brideSection, ourBigDaySection], {
                    visibility: 'hidden',
                    y: '0vh'
                }, "-=0.8")
                .set(ourBigDaySection, { y: '100vh' }, "-=0.8")
                .set(groomSection, {
                    opacity: 1,
                    visibility: 'visible'
                })
                // Animate groom content
                .fromTo('.groom-section .couple-img img', 
                    { x: -100, opacity: 0 },
                    { x: 0, opacity: 1, duration: 1, ease: "power2.out" },
                    "-=0.5"
                )
                .fromTo('.groom-section .couple-text > *',
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out" },
                    "-=0.7"
                );
            break;
            
        case 'bride':
            // Hide other sections and show bride with animation
            navTimeline
                .to([heroContent, groomSection, ourBigDaySection], {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.inOut"
                })
                .set([groomSection, ourBigDaySection], {
                    visibility: 'hidden',
                    y: '0vh'
                }, "-=0.8")
                .set(ourBigDaySection, { y: '100vh' }, "-=0.8")
                .set(brideSection, {
                    opacity: 1,
                    visibility: 'visible',
                    y: '0vh'
                })
                // Animate bride content
                .fromTo('.bride-section .couple-img img', 
                    { x: 100, opacity: 0 },
                    { x: 0, opacity: 1, duration: 1, ease: "power2.out" },
                    "-=0.5"
                )
                .fromTo('.bride-section .couple-text > *',
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out" },
                    "-=0.7"
                );
            break;
            
        case 'ourBigDay':
            // Hide other sections and show our big day with animation
            navTimeline
                .to([heroContent, groomSection, brideSection], {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.inOut"
                })
                .set([groomSection, brideSection], {
                    visibility: 'hidden',
                    y: '0vh'
                }, "-=0.8")
                .set(brideSection, { y: '-100vh' }, "-=0.8")
                .set(ourBigDaySection, {
                    opacity: 1,
                    visibility: 'visible',
                    y: '0vh'
                })
                // Animate our big day content
                .call(animateOurBigDayContent, [], "-=0.5");
            
            isOurBigDayScrollable = true;
            break;
    }
}

// MAIN ANIMATION - Smooth black screen movement
function initMainAnimation() {
    console.log('🎯 Initializing smooth animation...');

    // Initialize DOM elements
    blackScreenCurved = document.querySelector('.black-screen-curved');
    heroSection = document.querySelector('.hero-section');
    groomSection = document.querySelector('.groom-section');
    brideSection = document.querySelector('.bride-section');
    ourBigDaySection = document.querySelector('.our-big-day-section');
    heroContent = document.querySelector('.hero-content');
    
    // Initialize countdown timer
    initCountdown();
    
    // Set initial state
    gsap.set(blackScreenCurved, {
        height: "0%",
        borderRadius: "50% 50% 0 0",
        backgroundColor: "#000"
    });

    // Hide sections initially
    gsap.set([groomSection, brideSection], {
        opacity: 0,
        visibility: 'hidden'
    });

    // Set our big day section to be visible but below
    gsap.set(ourBigDaySection, {
        opacity: 1,
        visibility: 'visible',
        y: '100vh'
    });

    // Reset animation states
    scrollProgress = 0;
    isAnimating = false;
    currentSection = 'hero';
    canChangeSection = true;
    brideScrollProgress = 0;
    isOurBigDayScrollable = false;
    isScrollingOurBigDay = false;

    // SMOOTH black screen update using GSAP for buttery smoothness
    function updateBlackScreenSmooth(targetProgress) {
        scrollProgress = Math.max(0, Math.min(1, targetProgress));
        
        const height = scrollProgress * 100;
        const borderRadius = Math.max(50 - (scrollProgress * 100), 0);
        
        // Use GSAP for smooth interpolation
        gsap.to(blackScreenCurved, {
            height: `${height}%`,
            borderRadius: `${borderRadius}% ${borderRadius}% 0 0`,
            backgroundColor: scrollProgress > 0.6 ? 
                `rgb(${246 * ((scrollProgress - 0.6) / 0.4)}, ${230 * ((scrollProgress - 0.6) / 0.4)}, ${235 * ((scrollProgress - 0.6) / 0.4)})` : 
                "#000",
            duration: 0.1,
            ease: "power1.out",
            overwrite: true
        });
    }

    // SMOOTH bride section slide for scroll-driven animation with SNAP
    function updateBrideSectionSlide(targetProgress) {
        brideScrollProgress = Math.max(0, Math.min(1, targetProgress));
        
        // Add snap points - snap to 0%, 50%, or 100%
        let snappedProgress = brideScrollProgress;
        if (brideScrollProgress < 0.25) {
            snappedProgress = 0;
        } else if (brideScrollProgress > 0.75) {
            snappedProgress = 1;
        } else {
            snappedProgress = 0.5;
        }
        
        // Slide bride section UP based on scroll progress (revealing our big day underneath)
        gsap.to(brideSection, {
            y: `-${snappedProgress * 100}vh`,
            duration: 0.2,
            ease: "power1.out",
            overwrite: true
        });
        
        // Our big day section stays at the bottom, being revealed as bride slides up
        gsap.to(ourBigDaySection, {
            y: `${100 - (snappedProgress * 100)}vh`,
            duration: 0.2,
            ease: "power1.out",
            overwrite: true
        });
        
        brideScrollProgress = snappedProgress;
    }

    // Show groom section - SEAMLESS transition
    function showGroomSection() {
        if (!canChangeSection) return;
        canChangeSection = false;
        
        console.log('👔 Showing groom section - seamless transition');
        
        // INSTANT transition - no fade, just switch
        gsap.set(heroContent, { opacity: 0 });
        gsap.set(groomSection, {
            opacity: 1,
            visibility: 'visible'
        });

        // AMAZING GSAP animations for groom
        const groomTimeline = gsap.timeline({
            onComplete: function() {
                canChangeSection = true;
                currentSection = 'groom';
                console.log('✅ Groom section fully revealed');
            }
        });

        groomTimeline
            .fromTo('.groom-section .couple-img img', 
                { 
                    x: -600,
                    y: 100,
                    opacity: 0, 
                    rotationY: -180,
                    scale: 0.3,
                    filter: "blur(20px)"
                },
                { 
                    x: 0,
                    y: 0, 
                    opacity: 1, 
                    rotationY: 0, 
                    scale: 1,
                    filter: "blur(0px)",
                    duration: 1.8, 
                    ease: "elastic.out(1.2, 0.8)" 
                }
            )
            .fromTo('.groom-section .name',
                { 
                    x: 300,
                    y: -50,
                    opacity: 0,
                    scale: 0.1,
                    textShadow: "0 0 30px var(--gold)"
                },
                { 
                    x: 0,
                    y: 0, 
                    opacity: 1, 
                    scale: 1,
                    textShadow: "0 0 0px var(--gold)",
                    duration: 1.4, 
                    ease: "back.out(2)" 
                },
                "-=1.2"
            )
            .fromTo('.groom-section .quote',
                { 
                    x: 200,
                    opacity: 0,
                    scale: 0.8,
                    rotationZ: 5
                },
                { 
                    x: 0, 
                    opacity: 1, 
                    scale: 1,
                    rotationZ: 0,
                    duration: 1.2, 
                    ease: "power4.out" 
                },
                "-=0.8"
            )
            .fromTo('.groom-section .details p',
                { 
                    y: 80,
                    opacity: 0,
                    rotationX: 180,
                    scale: 0.5
                },
                { 
                    y: 0, 
                    opacity: 1, 
                    rotationX: 0,
                    scale: 1,
                    duration: 1, 
                    stagger: {
                        each: 0.4,
                        from: "start",
                        ease: "back.out(1.7)"
                    }, 
                    ease: "power3.out" 
                },
                "-=0.5"
            );
    }

    // Show bride section - SEAMLESS transition
    function showBrideSection() {
        if (!canChangeSection) return;
        canChangeSection = false;
        
        console.log('👰 Showing bride section - seamless transition');
        
        // INSTANT transition - hide groom, show bride
        gsap.set(groomSection, { opacity: 0, visibility: 'hidden' });
        gsap.set(brideSection, {
            opacity: 1,
            visibility: 'visible',
            y: '0vh'
        });

        // AMAZING GSAP animations for bride
        const brideTimeline = gsap.timeline({
            onComplete: function() {
                canChangeSection = true;
                currentSection = 'bride';
                brideScrollProgress = 0;
                isOurBigDayScrollable = false;
                console.log('✅ Bride section fully revealed');
            }
        });

        brideTimeline
            .fromTo('.bride-section .couple-img img', 
                { 
                    x: 600,
                    y: 100,
                    opacity: 0, 
                    rotationY: 180,
                    scale: 0.3,
                    filter: "blur(20px) brightness(2)"
                },
                { 
                    x: 0,
                    y: 0, 
                    opacity: 1, 
                    rotationY: 0, 
                    scale: 1,
                    filter: "blur(0px) brightness(1)",
                    duration: 1.8, 
                    ease: "elastic.out(1.2, 0.8)" 
                }
            )
            .fromTo('.bride-section .name',
                { 
                    x: -300,
                    y: -50,
                    opacity: 0,
                    scale: 0.1,
                    textShadow: "0 0 30px var(--gold)"
                },
                { 
                    x: 0,
                    y: 0, 
                    opacity: 1, 
                    scale: 1,
                    textShadow: "0 0 0px var(--gold)",
                    duration: 1.4, 
                    ease: "back.out(2)" 
                },
                "-=1.2"
            )
            .fromTo('.bride-section .quote',
                { 
                    x: -200,
                    opacity: 0,
                    scale: 0.8,
                    rotationZ: -5
                },
                { 
                    x: 0, 
                    opacity: 1, 
                    scale: 1,
                    rotationZ: 0,
                    duration: 1.2, 
                    ease: "power4.out" 
                },
                "-=0.8"
            )
            .fromTo('.bride-section .details p',
                { 
                    y: 80,
                    opacity: 0,
                    rotationX: -180,
                    scale: 0.5
                },
                { 
                    y: 0, 
                    opacity: 1, 
                    rotationX: 0,
                    scale: 1,
                    duration: 1, 
                    stagger: {
                        each: 0.4,
                        from: "start",
                        ease: "back.out(1.7)"
                    }, 
                    ease: "power3.out" 
                },
                "-=0.5"
            );
    }

    // Start bride to our big day scroll transition
    function startBrideToOurBigDayTransition() {
        console.log('🔄 Starting bride to our big day scroll transition');
        currentSection = 'brideScroll';
        brideScrollProgress = 0;
        isOurBigDayScrollable = false;
        isScrollingOurBigDay = false;
    }

    // Complete the transition to our big day
    function completeToOurBigDay() {
        if (!canChangeSection) return;
        canChangeSection = false;
        
        console.log('📅 Transition complete to Our Big Day');
        
        // Finalize positions - bride completely off screen
        gsap.to(brideSection, {
            y: '-100vh',
            duration: 0.3,
            ease: "power2.out"
        });
        
        gsap.to(ourBigDaySection, {
            y: '0vh',
            duration: 0.3,
            ease: "power2.out",
            onComplete: function() {
                currentSection = 'ourBigDay';
                canChangeSection = true;
                isOurBigDayScrollable = true;
                isScrollingOurBigDay = false;
                
                // Animate our big day content
                animateOurBigDayContent();
            }
        });
    }

    // Go back to bride from our big day scroll transition
    function startOurBigDayToBrideTransition() {
        if (!canChangeSection) return;
        canChangeSection = false;
        
        console.log('🔄 Starting our big day to bride scroll transition');
        currentSection = 'ourBigDayScroll';
        brideScrollProgress = 1;
        isOurBigDayScrollable = false;
        isScrollingOurBigDay = false;
        
        // Reset scroll position of our big day section
        ourBigDaySection.scrollTop = 0;
        
        canChangeSection = true;
    }

    // Complete the transition back to bride
    function completeToBride() {
        if (!canChangeSection) return;
        canChangeSection = false;
        
        console.log('👰 Transition complete back to bride');
        
        // Finalize positions - bride back to center
        gsap.to(brideSection, {
            y: '0vh',
            duration: 0.3,
            ease: "power2.out"
        });
        
        gsap.to(ourBigDaySection, {
            y: '100vh',
            duration: 0.3,
            ease: "power2.out",
            onComplete: function() {
                currentSection = 'bride';
                canChangeSection = true;
                brideScrollProgress = 0;
                isOurBigDayScrollable = false;
                isScrollingOurBigDay = false;
            }
        });
    }

    // Animate our big day content
    function animateOurBigDayContent() {
        const ourBigDayTimeline = gsap.timeline();
        
        ourBigDayTimeline
            .fromTo('.countdown-title',
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
            )
            .fromTo('.countdown-item',
                { y: 60, opacity: 0, scale: 0.8 },
                { 
                    y: 0, opacity: 1, scale: 1, duration: 0.6,
                    stagger: { each: 0.15, from: "start", ease: "back.out(1.7)" }
                },
                "-=0.5"
            )
            .fromTo('.date-display',
                { scale: 0, rotation: -180, opacity: 0 },
                { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: "elastic.out(1.2, 0.8)" },
                "-=0.3"
            )
            .fromTo('.save-date-section',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
                "-=0.2"
            )
            .fromTo('.venues-title',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
                "-=0.3"
            )
            .fromTo('.venue-card',
                { y: 50, opacity: 0, rotationY: 90 },
                { 
                    y: 0, opacity: 1, rotationY: 0, duration: 0.8,
                    stagger: { each: 0.2, from: "start", ease: "back.out(1.7)" }
                },
                "-=0.4"
            );
    }

    // Go back to groom from bride
    function backToGroom() {
        if (!canChangeSection) return;
        canChangeSection = false;
        
        console.log('↩️ Back to groom');
        
        // Reset bride position
        gsap.set(brideSection, { 
            y: '0vh',
            opacity: 0, 
            visibility: 'hidden' 
        });
        
        gsap.set(groomSection, {
            opacity: 1,
            visibility: 'visible'
        });

        const groomBackTimeline = gsap.timeline({
            onComplete: function() {
                canChangeSection = true;
                currentSection = 'groom';
            }
        });

        groomBackTimeline
            .fromTo('.groom-section .couple-img img', 
                { x: -100, opacity: 0.8 },
                { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
            )
            .fromTo('.groom-section .couple-text > *',
                { y: 20, opacity: 0.8 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.15, ease: "power2.out" },
                "-=0.4"
            );
    }

    // Go back to hero
    function backToHero() {
        if (!canChangeSection) return;
        canChangeSection = false;
        
        console.log('🏠 Back to hero');
        
        gsap.set(groomSection, { opacity: 0, visibility: 'hidden' });
        gsap.set(heroContent, { opacity: 1 });

        const blackScreenTimeline = gsap.timeline({
            onComplete: function() {
                canChangeSection = true;
                currentSection = 'hero';
                scrollProgress = 0;
            }
        });

        blackScreenTimeline
            .to(blackScreenCurved, {
                height: "100%",
                backgroundColor: "#f6e6eb",
                borderRadius: "0% 0% 0 0",
                duration: 0.1
            })
            .to(blackScreenCurved, {
                height: "0%",
                borderRadius: "50% 50% 0 0",
                backgroundColor: "#000",
                duration: 1.2,
                ease: "power3.out"
            });
    }

    // Handle scroll in Our Big Day section
    function handleOurBigDayScroll(e) {
        if (!isOurBigDayScrollable || isScrollingOurBigDay) return;
        
        const section = ourBigDaySection;
        const scrollTop = section.scrollTop;
        const isAtTop = scrollTop === 0;
        
        // If at top and scrolling up, go back to bride
        if (isAtTop && e.deltaY < -30 && !isAnimating) {
            isAnimating = true;
            isScrollingOurBigDay = true;
            startOurBigDayToBrideTransition();
            setTimeout(() => { 
                isAnimating = false; 
                isScrollingOurBigDay = false;
            }, 100);
            return;
        }
        
        // Allow normal scrolling within Our Big Day section
        // Don't prevent default - let the browser handle the scroll
        return;
    }

    // SMOOTH wheel event handler
    function handleWheel(e) {
        if (!canChangeSection) return;
        
        if (currentSection === 'hero') {
            e.preventDefault();
            const scrollDelta = e.deltaY;
            const sensitivity = 0.0008;
            const newProgress = scrollProgress + (scrollDelta * sensitivity);
            
            updateBlackScreenSmooth(newProgress);
            
            if (scrollProgress >= 0.99 && !isAnimating) {
                isAnimating = true;
                setTimeout(() => {
                    showGroomSection();
                    isAnimating = false;
                }, 50);
            }
        } 
        else if (currentSection === 'groom' && !isAnimating) {
            e.preventDefault();
            if (e.deltaY > 30) {
                isAnimating = true;
                showBrideSection();
                setTimeout(() => { isAnimating = false; }, 100);
            } else if (e.deltaY < -30) {
                isAnimating = true;
                backToHero();
                setTimeout(() => { isAnimating = false; }, 100);
            }
        }
        else if (currentSection === 'bride' && !isAnimating) {
            if (e.deltaY > 5) {
                e.preventDefault();
                isAnimating = true;
                startBrideToOurBigDayTransition();
                setTimeout(() => { isAnimating = false; }, 50);
            } else if (e.deltaY < -30) {
                e.preventDefault();
                isAnimating = true;
                backToGroom();
                setTimeout(() => { isAnimating = false; }, 100);
            }
        }
        else if (currentSection === 'brideScroll') {
            e.preventDefault();
            // Scroll-driven bride to our big day transition with SNAP
            const scrollDelta = e.deltaY;
            const sensitivity = 0.005;
            const newProgress = brideScrollProgress + (scrollDelta * sensitivity);
            
            updateBrideSectionSlide(newProgress);
            
            // Snap to complete transitions
            if (brideScrollProgress >= 0.75 && e.deltaY > 0) {
                completeToOurBigDay();
            } else if (brideScrollProgress <= 0.25 && e.deltaY < 0) {
                currentSection = 'bride';
                brideScrollProgress = 0;
                updateBrideSectionSlide(0);
            }
        }
        else if (currentSection === 'ourBigDay') {
            // Handle scroll within Our Big Day section - DON'T prevent default
            handleOurBigDayScroll(e);
        }
        else if (currentSection === 'ourBigDayScroll') {
            e.preventDefault();
            // Scroll-driven our big day to bride transition with SNAP
            const scrollDelta = e.deltaY;
            const sensitivity = 0.005;
            const newProgress = brideScrollProgress + (scrollDelta * sensitivity);
            
            updateBrideSectionSlide(newProgress);
            
            // Snap to complete transitions
            if (brideScrollProgress <= 0.25 && e.deltaY < 0) {
                completeToBride();
            } else if (brideScrollProgress >= 0.75 && e.deltaY > 0) {
                currentSection = 'ourBigDay';
                brideScrollProgress = 1;
                updateBrideSectionSlide(1);
                isOurBigDayScrollable = true;
            }
        }
    }

    // Add wheel event listener
    window.addEventListener('wheel', handleWheel, { passive: false });

    console.log('✅ Ultra-smooth animation ready!');
    console.log('✨ Proper splash screen fade implemented');
    console.log('👰 Smooth menu navigation with animations');
    console.log('📅 Our Big Day section animations fixed');
    console.log('🔄 Scroll functionality preserved after menu use');
}