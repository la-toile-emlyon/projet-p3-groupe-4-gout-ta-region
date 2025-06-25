// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- LOGIQUE COMMUNE OU D'INITIALISATION GLOBALE ---
    // Ajout de l'animation CSS @keyframes au document pour le logo du splash screen
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = `
        @keyframes pulse {
            0% { transform: scale(1); }
            100% { transform: scale(1.05); }
        }
    `;
    document.head.appendChild(styleSheet);


    // --- Animations spécifiques à la page d'accueil (index.html) ---
    if (document.body.classList.contains('index-page')) {

        // 1. Animation d'Introduction (Splash Screen) - Seulement sur la page d'accueil
        const splashScreen = document.createElement('div');
        splashScreen.id = 'splash-screen';
        splashScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: #00AF66; /* Vert du thème, comme demandé pour le fond */
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        `;
        const logo = document.createElement('img');
        logo.src = 'assets/logo_jaune.png'; // Utilisez kekro.svg si c'est le logo jaune sur fond vert comme sur la maquette
        // Si vous avez un fichier spécifique 'logo_jaune.png' qui est le logo SEUL en jaune, utilisez-le:
        // logo.src = 'assets/logo_jaune.png'; 
        logo.alt = 'Logo Kékro';
        logo.style.cssText = `
            width: 250px; /* Taille du logo plus visible */
            height: auto;
            cursor: pointer;
            animation: pulse 1.5s infinite alternate; /* Ajout d'une petite animation pour inviter au clic */
        `;
        splashScreen.appendChild(logo);
        document.body.appendChild(splashScreen);

        logo.addEventListener('click', () => {
            splashScreen.style.opacity = '0';
            splashScreen.style.transform = 'translateY(-100%)'; // Animation vers le haut
            setTimeout(() => {
                splashScreen.remove();
                document.body.style.overflow = 'auto'; // Rétablir le défilement
            }, 800); // Durée correspondant à la transition CSS
        }, { once: true }); // Le { once: true } assure que l'écouteur n'est activé qu'une seule fois.

        // Empêcher le défilement tant que le splash screen est visible
        document.body.style.overflow = 'hidden';


 // 2. Animation de l'Header (Contenu texte et image de l'application)
    const headerContent = document.querySelector('header #header');
    const headerImageContainer = document.querySelector('header #background-green');
    const headerSection = document.querySelector('header'); // Cibler la section <header>

    if (headerContent && headerImageContainer && headerSection) {
        // Styles initiaux (cachés et décalés pour l'animation)
        headerContent.style.opacity = '0';
        headerContent.style.transform = 'translateX(-50px)';
        headerContent.style.transition = 'opacity 1s ease-out, transform 1s ease-out';

        headerImageContainer.style.opacity = '0';
        headerImageContainer.style.transform = 'translateX(50px)';
        headerImageContainer.style.transition = 'opacity 1s ease-out, transform 1s ease-out';

        const animateHeader = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    headerContent.style.opacity = '1';
                    headerContent.style.transform = 'translateX(0)';
                    headerImageContainer.style.opacity = '1';
                    headerImageContainer.style.transform = 'translateX(0)';
                    observer.unobserve(entry.target); // Arrêter d'observer une fois l'animation déclenchée
                }
            });
        };

        // Utiliser un IntersectionObserver pour animer le header dès qu'il est visible
        const headerObserver = new IntersectionObserver(animateHeader, { threshold: 0.1 }); // Déclenchement dès 10% de visibilité
        headerObserver.observe(headerSection); // Observer la section entière du header

        // Gérer le cas du splash screen: Une fois qu'il est cliqué et disparaît, le header devient visible
        // Si le splash screen est présent, on peut aussi déclencher l'animation via son transitionend
        const splashScreenElement = document.getElementById('splash-screen');
        if (splashScreenElement) {
            splashScreenElement.addEventListener('transitionend', (e) => {
                if (e.propertyName === 'transform' && e.target.id === 'splash-screen') {
                    // Force le déclenchement si le header est déjà visible ou le sera bientôt
                    if (headerSection.getBoundingClientRect().top < window.innerHeight) {
                         headerContent.style.opacity = '1';
                         headerContent.style.transform = 'translateX(0)';
                         headerImageContainer.style.opacity = '1';
                         headerImageContainer.style.transform = 'translateX(0)';
                         headerObserver.disconnect(); // Arrêter l'observer
                    }
                }
            });
        }
    }
        // 3. Animation Vision, Mission, Valeurs (Effet "Flip Card" au survol)
        const vmvSections = document.querySelectorAll('#vision, #missions, #valeurs');

        vmvSections.forEach(section => {
            const description = section.querySelector('.description');
            const title = section.querySelector('.title');

            if (description && title) {
                section.addEventListener('mouseenter', () => {
                    title.style.transform = 'rotateY(-180deg)';
                    title.style.opacity = '0';
                    description.style.transform = 'rotateY(0deg)';
                    description.style.opacity = '1';
                });

                section.addEventListener('mouseleave', () => {
                    title.style.transform = 'rotateY(0deg)';
                    title.style.opacity = '1';
                    description.style.transform = 'rotateY(180deg)';
                    description.style.opacity = '0';
                });
            }
        });

        // 4. Animation des Statistiques (Compteur de chiffres)
        const statsSection = document.querySelector('#stats');
        const percentages = document.querySelectorAll('#stats .percentage');

        if (statsSection && percentages.length > 0) {
            const animateNumber = (element, target) => {
                let current = 0;
                const duration = 2000; // 2 secondes pour l'animation
                const increment = target / (duration / 10);

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        clearInterval(timer);
                        element.textContent = target + '%';
                    } else {
                        element.textContent = Math.floor(current) + '%';
                    }
                }, 10);
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        percentages.forEach(perc => {
                            const targetValue = parseInt(perc.textContent.replace('%', ''));
                            animateNumber(perc, targetValue);
                        });
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(statsSection);
        }

        // 5. Animation des Fonctionnalités (Téléphones et titres - Slide-in)
        const fonctionnalites = document.querySelectorAll('.fonctionalite');

        if (fonctionnalites.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const img = entry.target.querySelector('img');
                    const h3 = entry.target.querySelector('h3');

                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            if (img) {
                                img.style.opacity = '1';
                                img.style.transform = 'translateX(0)';
                            }
                            if (h3) {
                                h3.style.opacity = '1';
                                h3.style.transform = 'translateX(0)';
                            }
                        }, 100);

                        observer.unobserve(entry.target);
                    } else {
                        // Réinitialiser les styles si l'élément n'est plus visible (pour les réanimations)
                        if (img) {
                            img.style.opacity = '0';
                            img.style.transform = entry.target.classList.contains('reversed-order') ? 'translateX(-100px)' : 'translateX(100px)';
                        }
                        if (h3) {
                            h3.style.opacity = '0';
                            h3.style.transform = entry.target.classList.contains('reversed-order') ? 'translateX(100px)' : 'translateX(-100px)';
                        }
                    }
                });
            }, { threshold: 0.3 });

            // Appliquer les styles initiaux avant d'observer
            fonctionnalites.forEach(func => {
                const img = func.querySelector('img');
                const h3 = func.querySelector('h3');

                if (img) {
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
                    img.style.transform = func.classList.contains('reversed-order') ? 'translateX(-100px)' : 'translateX(100px)';
                }
                if (h3) {
                    h3.style.opacity = '0';
                    h3.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
                    h3.style.transform = func.classList.contains('reversed-order') ? 'translateX(100px)' : 'translateX(-100px)';
                }
                observer.observe(func);
            });
        }

    } // Fin des animations spécifiques à la page d'accueil


    // --- Animations spécifiques à la page de documentation (doc.html) ---
    // Ce bloc est maintenant distinct du bloc 'index-page'
    if (document.body.classList.contains('doc-page')) {

        // 1. Animation des sections générales (apparition au scroll)
        const docSectionsToAnimate = document.querySelectorAll('#contexte, #persona, .persona-details, #evolution, .features, #equipe, #demoApp');
        if (docSectionsToAnimate.length > 0) {
            const generalDocObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const delay = Array.from(docSectionsToAnimate).indexOf(entry.target) * 0.1;
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, delay * 1000);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            docSectionsToAnimate.forEach((section) => {
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
                generalDocObserver.observe(section);
            });
        }


        // 2. Animation "Nos évolutions" (zoom au survol des images)
        const maquetteImages = document.querySelectorAll('#maquettes img');
        maquetteImages.forEach(img => {
            img.style.transition = 'transform 0.3s ease-in-out';
            img.addEventListener('mouseover', () => {
                img.style.transform = 'scale(1.1)';
            });
            img.addEventListener('mouseout', () => {
                img.style.transform = 'scale(1)';
            });
        });

        // 3. Animation des fonctionnalités à venir (apparition séquentielle des cartes)
        const futureFeatures = document.querySelectorAll('.feature');
        if (futureFeatures.length > 0) {
             const featuresObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const delay = Array.from(futureFeatures).indexOf(entry.target) * 0.15;
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, delay * 1000);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            // Appliquer les styles initiaux
            futureFeatures.forEach((feature) => {
                feature.style.opacity = '0';
                feature.style.transform = 'translateY(50px)';
                feature.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                featuresObserver.observe(feature);
            });
        }


        // 4. L'équipe projet : Carrousel et animation des cartes
        const teamSection = document.querySelector('#equipe');
        const teamGridContainer = document.querySelector('.team-grid-container');
        const teamGrid = document.querySelector('.team-grid-square');
        const members = document.querySelectorAll('.member-card');

        if (teamSection && teamGridContainer && teamGrid && members.length > 0) {
            // Assurer que le conteneur .team-grid-square est assez large pour toutes les cartes sur une ligne
            teamGrid.style.width = `${(members.length / 4) * 100}%`; // Largeur pour 4 cartes par page

            // Appliquer les styles initiaux aux membres pour l'animation d'apparition
            members.forEach(member => {
                member.style.flexShrink = '0';
                member.style.opacity = '0';
                member.style.transform = 'translateY(20px)';
                member.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            });

            // Supprimer les boutons de navigation (logique supprimée car retirée du HTML)
            // L'effet carrousel sera juste un affichage des 4 membres sur une ligne sans navigation par boutons.

            // Observer l'apparition de la section équipe pour animer les cartes individuellement
            const teamObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        members.forEach((member, index) => {
                            setTimeout(() => {
                                member.style.opacity = '1';
                                member.style.transform = 'translateY(0)';
                            }, index * 150); // Délai de 150ms entre chaque carte
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            teamObserver.observe(teamSection); // Observer le conteneur de la section équipe

            // Pas de updateCarousel() initial car il n'y a plus de navigation par boutons
        }
    } // Fin des animations spécifiques à la page de documentation

}); // Fermeture correcte de document.addEventListener('DOMContentLoaded', ...)