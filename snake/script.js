document.addEventListener("DOMContentLoaded", function () {
    // Enregistrer le plugin ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initialiser l'animation
    initAnimation();
});

function initAnimation() {
    // Dimensions de la fenêtre
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Décalage pour éviter la barre de défilement
    const scrollbarOffset = 20;

    // Taille de l'image
    const imageSize = 40;

    // Position de départ (milieu gauche)
    const startY = windowHeight / 2;
    const startYPercent = (startY / windowHeight) * 100;

    // Récupérer les éléments
    const movingImage = document.getElementById('moving-image');
    const borderLeft = document.getElementById('border-left');
    const borderTop = document.getElementById('border-top');
    const borderRight = document.getElementById('border-right');
    const borderBottom = document.getElementById('border-bottom');

    // Ajustez ces valeurs de rotation en fonction de l'orientation naturelle de votre image
    const rotations = {
        up: 0,       // Pour monter
        right: 90,   // Pour aller à droite
        down: 180,   // Pour descendre
        left: 270    // Pour aller à gauche
    };

    // Rendre tous les segments de bord visibles
    gsap.set([borderLeft, borderTop, borderRight, borderBottom], {
        opacity: 1
    });

    // Configuration initiale des clip-paths pour chaque segment
    // Le segment gauche est initialement visible seulement au point de départ
    gsap.set(borderLeft, {
        clipPath: `inset(${startYPercent}% 0 ${100 - startYPercent}% 0)`
    });

    // Les autres segments sont complètement masqués
    gsap.set(borderTop, {
        clipPath: `inset(0 100% 0 0)`
    });

    gsap.set(borderRight, {
        clipPath: `inset(0 0 100% 0)`
    });

    gsap.set(borderBottom, {
        clipPath: `inset(0 0 0 100%)`
    });

    // Positionner l'image de tête au départ
    gsap.set(movingImage, {
        left: 0,
        top: startY - imageSize / 2, // Centrer verticalement
        rotation: rotations.up,
        opacity: 1
    });

    // Créer la timeline d'animation
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            markers: false
        }
    });

    // PHASE 1: MONTÉE LE LONG DU BORD GAUCHE
    // Animation de la tête
    tl.to(movingImage, {
        top: 0,
        duration: 0.2,
        ease: "none"
    });

    // Révélation du bord gauche (de bas en haut)
    tl.to(borderLeft, {
        clipPath: `inset(0 0 ${100 - startYPercent}% 0)`,
        duration: 0.2,
        ease: "none"
    }, "<"); // Commencer en même temps

    // PHASE 2: DÉPLACEMENT LE LONG DU BORD SUPÉRIEUR
    // Rotation de la tête au coin supérieur gauche
    tl.to(movingImage, {
        rotation: rotations.right,
        duration: 0.01,
        ease: "none"
    });

    // Déplacement de la tête vers la droite
    tl.to(movingImage, {
        left: windowWidth - scrollbarOffset - imageSize,
        duration: 0.19,
        ease: "none"
    });

    // Révélation progressive du bord supérieur (de gauche à droite)
    tl.to(borderTop, {
        clipPath: `inset(0 0 0 0)`,
        duration: 0.19,
        ease: "none"
    }, "<"); // Commencer en même temps

    // PHASE 3: DESCENTE LE LONG DU BORD DROIT
    // Rotation de la tête au coin supérieur droit
    tl.to(movingImage, {
        rotation: rotations.down,
        duration: 0.01,
        ease: "none"
    });

    // Déplacement de la tête vers le bas
    tl.to(movingImage, {
        top: windowHeight - imageSize,
        duration: 0.19,
        ease: "none"
    });

    // Révélation progressive du bord droit (de haut en bas)
    tl.to(borderRight, {
        clipPath: `inset(0 0 0 0)`,
        duration: 0.19,
        ease: "none"
    }, "<"); // Commencer en même temps

    // PHASE 4: DÉPLACEMENT LE LONG DU BORD INFÉRIEUR
    // Rotation de la tête au coin inférieur droit
    tl.to(movingImage, {
        rotation: rotations.left,
        duration: 0.01,
        ease: "none"
    });

    // Déplacement de la tête vers la gauche
    tl.to(movingImage, {
        left: 0,
        duration: 0.19,
        ease: "none"
    });

    // Révélation progressive du bord inférieur (de droite à gauche)
    tl.to(borderBottom, {
        clipPath: `inset(0 0 0 0)`,
        duration: 0.19,
        ease: "none"
    }, "<"); // Commencer en même temps

    // PHASE 5: REMONTÉE LE LONG DU BORD GAUCHE
    // Rotation de la tête au coin inférieur gauche
    tl.to(movingImage, {
        rotation: rotations.up + 360, // Ajouter 360 pour éviter la rotation inverse
        duration: 0.01,
        ease: "none"
    });

    // Déplacement de la tête vers le haut jusqu'au point de départ
    tl.to(movingImage, {
        top: startY - imageSize / 2,
        duration: 0.19,
        ease: "none"
    });

    // Révélation complète du bord gauche
    tl.to(borderLeft, {
        clipPath: `inset(0 0 0 0)`,
        duration: 0.19,
        ease: "none"
    }, "<"); // Commencer en même temps

    // Gérer le redimensionnement de la fenêtre
    window.addEventListener('resize', function () {
        // Recalculer les dimensions et valeurs clés
        const newWindowWidth = window.innerWidth;
        const newWindowHeight = window.innerHeight;
        const newStartY = newWindowHeight / 2;
        const newStartYPercent = (newStartY / newWindowHeight) * 100;

        // Réinitialiser les propriétés pour les nouveaux dimensions
        gsap.set(borderLeft, {
            clipPath: `inset(${newStartYPercent}% 0 ${100 - newStartYPercent}% 0)`
        });

        gsap.set(borderTop, {
            clipPath: `inset(0 100% 0 0)`
        });

        gsap.set(borderRight, {
            clipPath: `inset(0 0 100% 0)`
        });

        gsap.set(borderBottom, {
            clipPath: `inset(0 0 0 100%)`
        });

        // Réinitialiser la position de la tête
        gsap.set(movingImage, {
            left: 0,
            top: newStartY - imageSize / 2,
            rotation: rotations.up,
            opacity: 1
        });

        // Invalider et rafraîchir l'animation
        tl.invalidate();
        ScrollTrigger.refresh();
    });
}