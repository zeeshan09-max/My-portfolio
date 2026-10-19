
"use strict";

// Portfolio: Phase 1 to Phase 4
// Theme, navigation, skills and repeat-scroll animations.

document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;

    // =========================
    // THEME TOGGLE
    // =========================

    const themeButton = document.querySelector(".theme-toggle");
    const themeIcon = document.querySelector(".theme-icon");
    const themeLabel = document.querySelector(".theme-label");
    const themeMeta = document.querySelector('meta[name="theme-color"]');

    const sunSvg = `<svg viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.8"
        stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>
    </svg>`;

    const moonSvg = `<svg viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.8"
        stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true">
        <path d="M20.7 13.1A9 9 0 0 1 10.9 3.3 9 9 0 1 0 20.7 13.1Z"/>
    </svg>`;

    const preferredTheme = window.matchMedia(
        "(prefers-color-scheme: light)"
    );

    let savedTheme = null;

    try {
        savedTheme = localStorage.getItem("portfolio-theme");
    } catch (error) {
        // Storage is optional.
    }

    const initialTheme =
        savedTheme === "dark" || savedTheme === "light"
            ? savedTheme
            : preferredTheme.matches ? "light" : "dark";

    function applyTheme(theme) {
        root.dataset.theme = theme;

        const isDark = theme === "dark";

        if (themeButton) {
            themeButton.setAttribute(
                "aria-label",
                isDark
                    ? "Switch to light theme"
                    : "Switch to dark theme"
            );
        }

        if (themeIcon) {
            themeIcon.innerHTML = isDark ? sunSvg : moonSvg;
        }

        if (themeLabel) {
            themeLabel.textContent = isDark
                ? "Light Mode"
                : "Dark Mode";
        }

        if (themeMeta) {
            themeMeta.content = isDark
                ? "#080b14"
                : "#f7f9fd";
        }
    }

    applyTheme(initialTheme);

    themeButton?.addEventListener("click", () => {
        const nextTheme =
            root.dataset.theme === "dark" ? "light" : "dark";

        applyTheme(nextTheme);

        try {
            localStorage.setItem("portfolio-theme", nextTheme);
        } catch (error) {
            // Continue without saving.
        }
    });

    // =========================
    // MOBILE NAVIGATION
    // =========================

    const menuButton = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    function closeMenu() {
        if (!menuButton || !navLinks) return;

        navLinks.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation menu");
    }

    menuButton?.addEventListener("click", () => {
        if (!navLinks) return;

        const isOpen = navLinks.classList.toggle("is-open");

        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    navLinks?.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeMenu();
    });

    const desktopQuery = window.matchMedia("(min-width: 761px)");

    if (desktopQuery.addEventListener) {
        desktopQuery.addEventListener("change", event => {
            if (event.matches) closeMenu();
        });
    } else if (desktopQuery.addListener) {
        desktopQuery.addListener(event => {
            if (event.matches) closeMenu();
        });
    }

    // =========================
    // INTERACTIVE SKILLS
    // =========================

    const skillDetails = {
        "game-ui": [
            "Game UI / UX",
            "DESIGN FOUNDATION",
            "Designing clear, engaging game interfaces with a focus on visual hierarchy, readability, and player experience."
        ],
        "level-design": [
            "Level Design",
            "DESIGN FOUNDATION",
            "Planning game levels around pacing, player flow, challenge, and intuitive progression."
        ],
        "photoshop": [
            "Photoshop",
            "CREATIVE TOOL",
            "Creating and refining interface assets, compositions, and polished visual treatments."
        ],
        "illustrator": [
            "Illustrator",
            "CREATIVE TOOL",
            "Building clean vector graphics, icons, and scalable visual elements for digital interfaces."
        ],
        "figma": [
            "Figma",
            "CREATIVE TOOL",
            "Exploring interface layouts, components, and visual prototypes before development."
        ],
        "unity-blender": [
            "Unity & Blender",
            "CREATIVE TOOLKIT",
            "Working across game creation and 3D workflows to support interactive visual experiences."
        ],
        "html": [
            "HTML",
            "DEVELOPMENT - LEARNING",
            "Learning to structure semantic, accessible web pages and meaningful content."
        ],
        "css": [
            "CSS",
            "DEVELOPMENT - LEARNING",
            "Practicing responsive layouts, design systems, styling, and smooth interface transitions."
        ],
        "javascript": [
            "JavaScript",
            "DEVELOPMENT - LEARNING",
            "Building confidence with DOM interactions, event handling, and interactive web experiences."
        ],
        "python": [
            "Python",
            "DEVELOPMENT - LEARNING",
            "Developing programming fundamentals through practical exercises and small projects."
        ]
    };

    const skillTabs = document.querySelectorAll("[data-skill-filter]");
    const skillGroups = document.querySelectorAll("[data-skill-group]");
    const skillTiles = document.querySelectorAll("[data-skill]");

    const spotlightTitle = document.querySelector("#skill-spotlight-title");
    const spotlightStatus = document.querySelector("#skill-spotlight-status");
    const spotlightDescription = document.querySelector("#skill-spotlight-description");

    function selectSkill(id) {
        const details = skillDetails[id];
        if (!details) return;

        skillTiles.forEach(tile => {
            const selected = tile.dataset.skill === id;

            tile.classList.toggle("is-selected", selected);
            tile.setAttribute("aria-pressed", String(selected));
        });

        if (spotlightTitle) spotlightTitle.textContent = details[0];
        if (spotlightStatus) spotlightStatus.textContent = details[1];
        if (spotlightDescription) spotlightDescription.textContent = details[2];
    }

    skillTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const category = tab.dataset.skillFilter;

            skillTabs.forEach(button => {
                const active = button === tab;

                button.classList.toggle("is-active", active);
                button.setAttribute("aria-pressed", String(active));
            });

            skillGroups.forEach(group => {
                group.hidden = group.dataset.skillGroup !== category;
            });

            const first = document.querySelector(
                `[data-skill-group="${category}"] [data-skill]`
            );

            if (first) selectSkill(first.dataset.skill);
        });
    });

    skillTiles.forEach(tile => {
        tile.addEventListener("click", () => {
            selectSkill(tile.dataset.skill);
        });
    });

    // =========================
    // REPEAT SCROLL ANIMATIONS
    // =========================

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
        return;
    }

    const sections = document.querySelectorAll("main > .section");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const section = entry.target;
            const visible = entry.isIntersecting;

            section.classList.toggle("is-visible", visible);

            section.querySelectorAll(".card-reveal").forEach(card => {
                card.classList.toggle("is-visible", visible);
            });
        });
    }, {
        threshold: 0,
        rootMargin: "-10% 0px -10% 0px"
    });

    sections.forEach(section => {
        section.classList.add("scroll-reveal");

        section.querySelectorAll(
            ".project-card, .journey-step"
        ).forEach((card, index) => {
            card.classList.add("card-reveal");

            card.style.setProperty(
                "--card-delay",
                `${index * 120}ms`
            );
        });

        observer.observe(section);
    });

    // Skill tiles animate independently.
    const skillTilesForAnimation = document.querySelectorAll(
        ".skill-tile"
    );

    const tileObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            entry.target.classList.toggle(
                "is-visible",
                entry.isIntersecting
            );
        });
    }, {
        threshold: 0.05,
        rootMargin: "0px 0px -20px 0px"
    });

    skillTilesForAnimation.forEach(tile => {
        tile.classList.add("skill-reveal");
        tileObserver.observe(tile);
    });

    // Reveal tiles when switching categories.
    skillTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const activeGroup = document.querySelector(
                `[data-skill-group="${tab.dataset.skillFilter}"]`
            );

            activeGroup?.querySelectorAll(".skill-tile").forEach(tile => {
                tile.classList.add("is-visible");
            });
        });
    });

    root.classList.add("motion-ready");
});
