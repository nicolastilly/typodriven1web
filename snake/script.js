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

    // Récupérer les éléments
    const movingImage = document.getElementById('moving-image');
    const borderPath = document.getElementById('border-path');

    // Ajustez ces valeurs de rotation en fonction de l'orientation naturelle de votre image
    const rotations = {
        up: 0,       // Pour monter
        right: 90,   // Pour aller à droite
        down: 180,   // Pour descendre
        left: 270    // Pour aller à gauche
    };

    // Marge pour les bords
    const margin = 20;

    // Définir les coordonnées des coins et les rotations dans les deux sens
    const corners = [
        {
            x: margin, y: startY,
            forward: rotations.up,     // En descendant: vers le haut
            backward: rotations.up     // En remontant: vers le haut
        },
        {
            x: margin, y: margin,
            forward: rotations.right,  // En descendant: vers la droite
            backward: rotations.up   // En remontant: vers la droite
        },
        {
            x: windowWidth - scrollbarOffset - margin, y: margin,
            forward: rotations.down,   // En descendant: vers le bas
            backward: rotations.right     // En remontant: vers le haut
        },
        {
            x: windowWidth - scrollbarOffset - margin, y: windowHeight - margin,
            forward: rotations.left,   // En descendant: vers la gauche
            backward: rotations.down   // En remontant: vers le bas
        },
        {
            x: margin, y: windowHeight - margin,
            forward: rotations.up,     // En descendant: vers le haut
            backward: rotations.left   // En remontant: vers la gauche
        },
        {
            x: margin, y: startY,
            forward: rotations.up,     // En descendant: vers le haut
            backward: rotations.down   // En remontant: vers le bas
        }
    ];

    // Créer le chemin SVG pour le contour
    const pathData = corners.map((corner, index) => {
        return (index === 0) ? `M ${corner.x},${corner.y}` : `L ${corner.x},${corner.y}`;
    }).join(" ");

    // Définir le chemin SVG
    borderPath.setAttribute('d', pathData);

    // Calculer la longueur totale du chemin
    const pathLength = borderPath.getTotalLength();

    // Configurer les propriétés initiales du chemin SVG
    borderPath.style.strokeDasharray = pathLength;
    borderPath.style.strokeDashoffset = pathLength;

    // Positionner l'image de tête au départ
    gsap.set(movingImage, {
        left: margin - imageSize / 2,
        top: startY - imageSize / 2,
        rotation: rotations.up,
        opacity: 1
    });

    // Créer la timeline d'animation pour le chemin SVG
    const tlPath = gsap.timeline({
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            markers: false
        }
    });

    // Animation du tracé SVG (dessin progressif)
    tlPath.to(borderPath, {
        strokeDashoffset: 0, // Révéler progressivement tout le chemin
        duration: 1,
        ease: "none"
    });

    // Fonction pour calculer la position sur le chemin
    function getPointAtLength(length) {
        return borderPath.getPointAtLength(length);
    }

    // Créer la timeline d'animation pour l'image
    const tlImage = gsap.timeline({
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            markers: false
        }
    });

    // Distance de tolérance pour détecter les coins
    const cornerTolerance = 10; // en pixels

    // Variable pour stocker l'orientation actuelle et le dernier point
    let currentRotation = rotations.up;
    let lastProgress = 0;
    let lastCornerIndex = 0;

    // Animation de l'image le long du chemin
    tlImage.to(movingImage, {
        duration: 1,
        ease: "none",
        onUpdate: function () {
            // Calculer la progression actuelle (0 à 1)
            const progress = this.progress();

            // Déterminer la direction du défilement
            const isMovingForward = progress >= lastProgress;

            // Calculer la longueur correspondante sur le chemin
            const currentLength = pathLength * (1 - progress);

            // Obtenir le point actuel sur le chemin
            const point = getPointAtLength(pathLength - currentLength);

            // Vérifier si nous sommes proche d'un coin
            let foundCorner = false;

            for (let i = 0; i < corners.length; i++) {
                const corner = corners[i];

                // Calculer la distance entre le point actuel et ce coin
                const distance = Math.sqrt(
                    Math.pow(point.x - corner.x, 2) +
                    Math.pow(point.y - corner.y, 2)
                );

                // Si nous sommes suffisamment proche d'un coin, changer l'orientation
                if (distance < cornerTolerance) {
                    // Appliquer la rotation adaptée selon le sens du défilement
                    currentRotation = isMovingForward ? corner.forward : corner.backward;
                    lastCornerIndex = i;
                    foundCorner = true;
                    break;
                }
            }

            // Si nous ne sommes pas sur un coin, déterminer l'orientation en fonction du segment
            if (!foundCorner && !isNaN(point.x) && !isNaN(point.y)) {
                // Dans ce cas, nous conservons l'orientation actuelle
                // La rotation ne change qu'aux coins
            }

            // Mettre à jour la position et la rotation de l'image
            gsap.set(movingImage, {
                left: point.x - imageSize / 2,
                top: point.y - imageSize / 2,
                rotation: currentRotation
            });

            // Mettre à jour la dernière progression pour la prochaine frame
            lastProgress = progress;
        }
    });

    // Gérer le redimensionnement de la fenêtre
    window.addEventListener('resize', function () {
        // Mettre à jour les dimensions
        const newWindowWidth = window.innerWidth;
        const newWindowHeight = window.innerHeight;
        const newStartY = newWindowHeight / 2;

        // Mettre à jour les coordonnées des coins
        corners[0] = {
            x: margin, y: newStartY,
            forward: rotations.up, backward: rotations.up
        };
        corners[1] = {
            x: margin, y: margin,
            forward: rotations.right, backward: rotations.right
        };
        corners[2] = {
            x: newWindowWidth - scrollbarOffset - margin, y: margin,
            forward: rotations.down, backward: rotations.up
        };
        corners[3] = {
            x: newWindowWidth - scrollbarOffset - margin, y: newWindowHeight - margin,
            forward: rotations.left, backward: rotations.down
        };
        corners[4] = {
            x: margin, y: newWindowHeight - margin,
            forward: rotations.up, backward: rotations.left
        };
        corners[5] = {
            x: margin, y: newStartY,
            forward: rotations.up, backward: rotations.down
        };

        // Recréer le chemin SVG
        const newPathData = corners.map((corner, index) => {
            return (index === 0) ? `M ${corner.x},${corner.y}` : `L ${corner.x},${corner.y}`;
        }).join(" ");

        borderPath.setAttribute('d', newPathData);

        // Recalculer la longueur du chemin
        const newPathLength = borderPath.getTotalLength();
        borderPath.style.strokeDasharray = newPathLength;

        // Réinitialiser la position de départ de l'image
        gsap.set(movingImage, {
            left: margin - imageSize / 2,
            top: newStartY - imageSize / 2,
            rotation: rotations.up,
            opacity: 1
        });

        // Réinitialiser les variables de suivi
        currentRotation = rotations.up;
        lastProgress = 0;
        lastCornerIndex = 0;

        // Invalider les animations
        tlPath.invalidate();
        tlImage.invalidate();

        // Rafraîchir ScrollTrigger
        ScrollTrigger.refresh();
    });
}