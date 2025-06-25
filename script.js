// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- LOGIQUE COMMUNE OU D'INITIALISATION GLOBALE ---
    // Ajout de l'animation CSS @keyframes au document pour le logo du splash screen (peut être commun aux deux pages si le splash est partout)
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

        // 1. Animation d'Introduction (Splash Screen)
        const splashScreen = document.createElement('div');
        splashScreen.id = 'splash-screen';
        splashScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: #F5F5DC; /* Couleur du fond de la page pour correspondre */
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        `;
        const logo = document.createElement('img');
        logo.src = 'assets/kekro.svg'; // Utilisation de kekro.svg pour la cohérence
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
        const headerImageContainer = document.querySelector('header #background-green'); // Le conteneur de l'image

        if (headerContent && headerImageContainer) {
            // Styles initiaux (cachés et décalés pour l'animation)
            headerContent.style.opacity = '0';
            headerContent.style.transform = 'translateX(-50px)';
            headerContent.style.transition = 'opacity 1s ease-out, transform 1s ease-out';

            headerImageContainer.style.opacity = '0';
            headerImageContainer.style.transform = 'translateX(50px)';
            headerImageContainer.style.transition = 'opacity 1s ease-out, transform 1s ease-out';

            const animateHeader = () => {
                headerContent.style.opacity = '1';
                headerContent.style.transform = 'translateX(0)';
                headerImageContainer.style.opacity = '1';
                headerImageContainer.style.transform = 'translateX(0)';
            };

            // Déclencher l'animation après la disparition du splash screen
            const splashScreenElement = document.getElementById('splash-screen');
            if (splashScreenElement) {
                splashScreenElement.addEventListener('transitionend', (e) => {
                    if (e.propertyName === 'transform' && e.target.id === 'splash-screen') {
                        setTimeout(animateHeader, 200); // Petit délai après le retrait du splash
                    }
                });
            } else {
                // Si pour une raison ou une autre le splash screen n'existe pas, animer après un court délai
                setTimeout(animateHeader, 500);
            }
        }

        // 3. Animation Vision, Mission, Valeurs (Effet "Flip Card" au survol)
        const vmvSections = document.querySelectorAll('#vision, #missions, #valeurs');

        vmvSections.forEach(section => {
            const description = section.querySelector('.description');
            const title = section.querySelector('.title');

            if (description && title) {
                // Au survol :
                section.addEventListener('mouseenter', () => {
                    title.style.transform = 'rotateY(-180deg)';
                    title.style.opacity = '0';
                    description.style.transform = 'rotateY(0deg)';
                    description.style.opacity = '1';
                });

                // Quand la souris quitte :
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
                const increment = target / (duration / 10); // Calcul de l'incrément par intervalle de 10ms

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        clearInterval(timer);
                        element.textContent = target + '%';
                    } else {
                        element.textContent = Math.floor(current) + '%';
                    }
                }, 10); // Met à jour toutes les 10ms
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        percentages.forEach(perc => {
                            const targetValue = parseInt(perc.textContent.replace('%', ''));
                            animateNumber(perc, targetValue);
                        });
                        observer.disconnect(); // Arrêter d'observer une fois l'animation déclenchée
                    }
                });
            }, { threshold: 0.5 }); // Déclenchement lorsque 50% de la section est visible

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
                        // Animer l'apparition
                        setTimeout(() => {
                            if (img) {
                                img.style.opacity = '1';
                                img.style.transform = 'translateX(0)';
                            }
                            if (h3) {
                                h3.style.opacity = '1';
                                h3.style.transform = 'translateX(0)';
                            }
                        }, 100); // Léger délai pour l'effet

                        observer.unobserve(entry.target); // Ne plus observer après l'animation
                    } else {
                        // Réinitialiser les styles si l'élément n'est plus visible (pour les réanimations si on défile)
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
            }, { threshold: 0.3 }); // Déclenchement à 30% de visibilité

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
    if (document.body.classList.contains('doc-page')) {

        // 1. Animation des sections générales (apparition au scroll)
        const docSectionsToAnimate = document.querySelectorAll('#contexte, #persona, .persona-details, #evolution, .features, #equipe');
        if (docSectionsToAnimate.length > 0) {
            const generalDocObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Appliquer un délai séquentiel pour chaque section
                        const delay = Array.from(docSectionsToAnimate).indexOf(entry.target) * 0.1; // 100ms de délai
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, delay * 1000); // Convertir en ms
                        observer.unobserve(entry.target); // Cesser d'observer après animation
                    }
                });
            }, { threshold: 0.1 }); // Déclenchement rapide à 10% de visibilité

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
                        // Délai séquentiel pour chaque carte dans la grille
                        const delay = Array.from(futureFeatures).indexOf(entry.target) * 0.15; // 150ms de délai
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, delay * 1000); // Convertir en ms
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 }); // Déclenchement à 30% de visibilité

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
            let currentIndex = 0;
            const membersPerPage = 4; // Afficher 4 membres par ligne

            // Assurer que le conteneur .team-grid-square est assez large pour toutes les cartes sur une ligne
            teamGrid.style.width = `${(members.length / membersPerPage) * 100}%`;

            // Appliquer les styles initiaux aux membres pour l'animation d'apparition
            members.forEach(member => {
                member.style.flexShrink = '0';
                member.style.opacity = '0';
                member.style.transform = 'translateY(20px)';
                member.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            });

            const updateCarousel = () => {
                teamGrid.style.transition = 'transform 0.5s ease-in-out';
                teamGrid.style.transform = `translateX(-${currentIndex * (100 / membersPerPage)}%)`;
            };

            // Créer les boutons de navigation (Précédent/Suivant)
            const carouselNav = document.createElement('div');
            carouselNav.style.cssText = `
                display: flex;
                justify-content: center;
                gap: 15px;
                margin-top: 30px;
                padding-bottom: 20px;
            `;
            const prevBtn = document.createElement('button');
            prevBtn.textContent = '< Précédent';
            prevBtn.className = 'carousel-btn'; // Classe pour styler les boutons
            const nextBtn = document.createElement('button');
            nextBtn.textContent = 'Suivant >';
            nextBtn.className = 'carousel-btn'; // Classe pour styler les boutons

            carouselNav.appendChild(prevBtn);
            carouselNav.appendChild(nextBtn);
            teamSection.appendChild(carouselNav); // Ajouter les boutons à la section équipe


            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            });

            nextBtn.addEventListener('click', () => {
                // S'assurer que le carrousel ne va pas au-delà du nombre de cartes
                if (currentIndex < Math.ceil(members.length / membersPerPage) - 1) {
                    currentIndex++;
                    updateCarousel();
                }
            });

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
            }, { threshold: 0.1 }); // Déclenchement à 10% de visibilité

            teamObserver.observe(teamSection); // Observer le conteneur de la section équipe

            updateCarousel(); // Initialiser la position du carrousel
        }
    } // Fin des animations spécifiques à la page de documentation

}); // Fermeture correcte de document.addEventListener('DOMContentLoaded', ...)