// script.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Animation d'Introduction (Splash Screen)
    // Code pour créer et gérer le splash screen
    const splashScreen = document.createElement('div');
    splashScreen.id = 'splash-screen';
    splashScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: #00AF66; /* Vert de Kékro */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    `;
    const logo = document.createElement('img');
    logo.src = 'assets/logo_jaune.png'; // Assurez-vous que le chemin est correct
    logo.alt = 'Logo Kékro';
    logo.style.cssText = `
            width: 250px; /* Taille du logo plus visible */
            height: auto;
            cursor: pointer;
            animation: pulse 1.5s infinite alternate; 
    `;
    splashScreen.appendChild(logo);
    document.body.appendChild(splashScreen);

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


    // 2. Animation de l'Header (Image du téléphone)
    const headerImage = document.querySelector('header #background-green img');
    if (headerImage) {
        headerImage.style.opacity = '0';
        headerImage.style.transform = 'translateX(50px)';
        // Animer au chargement de la page (ou au clic sur le splash screen)
        setTimeout(() => { // Délai après la disparition du splash screen
            headerImage.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            headerImage.style.opacity = '1';
            headerImage.style.transform = 'translateX(0)';
        }, 1000); // Léger délai
    }

        // 3. Animation Vision, Mission, Valeurs (Effet "Flip Card" au survol)
        const vmvSections = document.querySelectorAll('#vision, #missions, #valeurs');

        vmvSections.forEach(section => {
            const description = section.querySelector('.description');
            const title = section.querySelector('.title');

            if (description && title) {
                // Initialisation des styles pour la transition (déjà dans CSS, mais confirmation ici)
                // Le JS va gérer l'affichage et la rotation

                section.addEventListener('mouseenter', () => {
                    title.style.transform = 'rotateY(-180deg)';
                    title.style.opacity = '0';
                    description.style.transform = 'rotateY(0deg)';
                    description.style.opacity = '1';
                    // Animation pour grossir le texte de description
                    description.style.transform = 'scale(1.05)';
                });

                section.addEventListener('mouseleave', () => {
                    title.style.transform = 'rotateY(0deg)';
                    title.style.opacity = '1';
                    description.style.transform = 'rotateY(180deg)';
                    description.style.opacity = '0';
                    // Revenir à la taille normale
                    description.style.transform = 'scale(1)';
                });
            }
        });

        // 4. Animation des Statistiques (Compteur de chiffres)
    const statsSection = document.querySelector('#stats');
    const percentages = document.querySelectorAll('#stats .percentage');

    if (statsSection && percentages.length > 0) {
        const animateNumber = (element, target) => {
            let current = 0;
            const duration = 2000; // 2 secondes
            const step = (target / (duration / 10)); // Ajuster la vitesse

            const timer = setInterval(() => {
                current += step;
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
                    observer.disconnect(); // Arrêter d'observer après l'animation
                }
            });
        }, { threshold: 0.5 }); // Déclenchement à 50% de visibilité

        observer.observe(statsSection);
    }

    // 4. Animation des Fonctionnalités (Téléphones et titres)
    const fonctionnalites = document.querySelectorAll('.fonctionalite');
    if (fonctionnalites.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target.querySelector('img');
                    const h3 = entry.target.querySelector('h3');

                    // Styles initiaux pour l'animation
                    if (img) {
                        img.style.opacity = '0';
                        img.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
                    }
                    if (h3) {
                        h3.style.opacity = '0';
                        h3.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
                    }

                    // Déterminer la direction de l'animation
                    if (entry.target.classList.contains('fonctionalite')) { // Pour les éléments fonctionalite
                        if (entry.target.querySelector('img').parentNode.classList.contains('fonctionalite:nth-child(even)')) { // Si l'image est à gauche
                            if (img) img.style.transform = 'translateX(-50px)';
                            if (h3) h3.style.transform = 'translateX(50px)';
                        } else { // Si l'image est à droite
                            if (img) img.style.transform = 'translateX(50px)';
                            if (h3) h3.style.transform = 'translateX(-50px)';
                        }
                    }

                    // Appliquer les styles finaux avec un délai
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

                    observer.unobserve(entry.target); // Ne plus observer après animation
                }
            });
        }, { threshold: 0.3 }); // Déclenchement à 30% de visibilité

        fonctionnalites.forEach(func => observer.observe(func));
    }


    // DOCUMENTATION PAGE ANIMATIONS (pour doc.html)

    // Vérifier si nous sommes sur la page de documentation
    if (document.body.classList.contains('doc-page')) { // Ajouter une classe "doc-page" au body de doc.html
        // Animation pour "Nos évolutions" (zoom au survol)
        const maquetteImages = document.querySelectorAll('#maquettes img');
        maquetteImages.forEach(img => {
            img.style.transition = 'transform 0.3s ease-in-out';
            img.addEventListener('mouseover', () => {
                img.style.transform = 'scale(1.1)'; // Épaississement/zoom
            });
            img.addEventListener('mouseout', () => {
                img.style.transform = 'scale(1)';
            });
        });


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

        // 3. Animation des fonctionnalités à venir (apparition séquentielle)
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

            futureFeatures.forEach((feature) => {
                feature.style.opacity = '0';
                feature.style.transform = 'translateY(50px)';
                feature.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                featuresObserver.observe(feature);
            });
        }

       

        // 4. L'équipe projet : Carrousel et animation des cartes
        const teamSection = document.querySelector('#equipe');
        const teamGridContainer = document.querySelector('.team-grid-container'); // Le nouveau conteneur pour l'overflow
        const teamGrid = document.querySelector('.team-grid-square');
        const members = document.querySelectorAll('.member-card');

        if (teamSection && teamGridContainer && teamGrid && members.length > 0) {
            let currentIndex = 0;
            const membersPerPage = 4; // Afficher 4 membres par ligne

            // Ajuster la largeur des membres (déjà dans CSS, mais s'assurer ici aussi si besoin)
            members.forEach(member => {
                member.style.flexShrink = '0';
            });

            const updateCarousel = () => {
                teamGrid.style.transition = 'transform 0.5s ease-in-out';
                // Calcul de la translation : (index actuel * largeur d'un membre * nombre de membres par page)
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
            prevBtn.className = 'carousel-btn';
            const nextBtn = document.createElement('button');
            nextBtn.textContent = 'Suivant >';
            nextBtn.className = 'carousel-btn';

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

            members.forEach(member => {
                member.style.opacity = '0';
                member.style.transform = 'translateY(20px)';
                member.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            });
            teamObserver.observe(teamSection); // Observer le conteneur de la section équipe

            updateCarousel(); // Initialiser la position du carrousel
        }
    } // Fin des animations spécifiques à la page de documentation

});

    // Styles et animations d'apparition générales pour les sections (si non spécifiques)
    const sectionsToAnimate = document.querySelectorAll('main section:not(#stats):not(#fonctionnalites)'); // Exclure celles déjà traitées
    if (document.body.classList.contains('doc-page')) {
        sectionsToAnimate.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        });

        const generalObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    generalObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        sectionsToAnimate.forEach(section => generalObserver.observe(section));
    }
});