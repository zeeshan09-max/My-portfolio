"use strict";

/**
 * Portfolio interactions.
 * Each initializer owns one feature, keeping event listeners and state isolated.
 * No third-party JavaScript dependencies are required.
 */
document.documentElement.classList.add("js");

const THEME_STORAGE_KEY = "portfolio-theme";
const MOBILE_NAV_QUERY = "(min-width: 761px)";

/** Read a stored preference without breaking in restricted/private contexts. */
function readThemePreference() {
    try {
        const value = localStorage.getItem(THEME_STORAGE_KEY);
        return value === "dark" || value === "light" ? value : null;
    } catch {
        return null;
    }
}

function saveThemePreference(theme) {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
        // The switch remains usable when browser storage is unavailable.
    }
}

/**
 * Synchronize visual theme, accessible switch state, and browser toolbar color.
 * The switch represents the CURRENT mode: checked means light.
 */
function initTheme() {
    const root = document.documentElement;
    const switchButton = document.querySelector(".theme-toggle");
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)");

    function setTheme(theme, persist = false) {
        const isLight = theme === "light";
        root.dataset.theme = isLight ? "light" : "dark";
        switchButton?.setAttribute("aria-checked", String(isLight));
        switchButton?.setAttribute("aria-label", `Color theme: ${isLight ? "Light" : "Dark"}. Switch to ${isLight ? "Dark" : "Light"}`);
        if (themeMeta) themeMeta.content = isLight ? "#f7f9fd" : "#080b14";
        if (persist) saveThemePreference(theme);
    }

    setTheme(readThemePreference() ?? (systemPrefersLight.matches ? "light" : "dark"));
    if (!switchButton) return;

    let pointerStart = null;
    let suppressNextClick = false;

    switchButton.addEventListener("pointerdown", event => {
        if (event.button !== 0 || !event.isPrimary) return;
        pointerStart = { id: event.pointerId, x: event.clientX };
        suppressNextClick = false;
        switchButton.setPointerCapture?.(event.pointerId);
    });

    switchButton.addEventListener("pointerup", event => {
        if (!pointerStart || pointerStart.id !== event.pointerId) return;
        const moved = Math.abs(event.clientX - pointerStart.x) > 7;
        pointerStart = null;
        if (!moved) return; // Ordinary clicks are handled by the click listener.

        // A drag chooses the side on which the pointer is released.
        const rect = switchButton.getBoundingClientRect();
        setTheme(event.clientX < rect.left + rect.width / 2 ? "dark" : "light", true);
        suppressNextClick = true; // Avoid a second toggle from the synthetic click.
    });

    switchButton.addEventListener("pointercancel", () => {
        pointerStart = null;
    });

    switchButton.addEventListener("click", event => {
        if (event.detail === 0) suppressNextClick = false; // Keyboard activation.
        if (suppressNextClick) {
            suppressNextClick = false;
            return;
        }
        setTheme(root.dataset.theme === "light" ? "dark" : "light", true);
    });
}

/** Mobile menu state stays in sync with ARIA and desktop breakpoints. */
function initNavigation() {
    const menuButton = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    if (!menuButton || !navLinks) return;

    function setMenuOpen(isOpen) {
        navLinks.classList.toggle("is-open", isOpen);
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    }

    menuButton.addEventListener("click", () => {
        setMenuOpen(!navLinks.classList.contains("is-open"));
    });
    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => setMenuOpen(false));
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") setMenuOpen(false);
    });

    const desktop = window.matchMedia(MOBILE_NAV_QUERY);
    const onViewportChange = event => {
        if (event.matches) setMenuOpen(false);
    };
    if (desktop.addEventListener) desktop.addEventListener("change", onViewportChange);
    else desktop.addListener(onViewportChange); // Legacy browser support.
}

/** Details are content data, separate from event handlers and DOM operations. */
const SKILL_DETAILS = {
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

/** Update selected skill and its accessible detail panel. */
function initSkills() {
    const tabs = [...document.querySelectorAll("[data-skill-filter]")];
    const groups = [...document.querySelectorAll("[data-skill-group]")];
    const tiles = [...document.querySelectorAll("[data-skill]")];
    const title = document.querySelector("#skill-spotlight-title");
    const status = document.querySelector("#skill-spotlight-status");
    const description = document.querySelector("#skill-spotlight-description");

    function selectSkill(id) {
        const details = SKILL_DETAILS[id];
        if (!details) return;
        tiles.forEach(tile => {
            const selected = tile.dataset.skill === id;
            tile.classList.toggle("is-selected", selected);
            tile.setAttribute("aria-pressed", String(selected));
        });
        if (title) title.textContent = details[0];
        if (status) status.textContent = details[1];
        if (description) description.textContent = details[2];
    }

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const category = tab.dataset.skillFilter;
            const activeGroup = groups.find(group => group.dataset.skillGroup === category);
            if (!activeGroup) return;

            tabs.forEach(item => {
                const selected = item === tab;
                item.classList.toggle("is-active", selected);
                item.setAttribute("aria-pressed", String(selected));
            });
            groups.forEach(group => {
                group.hidden = group !== activeGroup;
            });
            const firstTile = activeGroup.querySelector("[data-skill]");
            if (firstTile) selectSkill(firstTile.dataset.skill);
        });
    });

    tiles.forEach(tile => {
        tile.addEventListener("click", () => selectSkill(tile.dataset.skill));
    });
}

/**
 * Reveal effects are progressive enhancement: content remains visible when
 * motion is reduced or IntersectionObserver is unavailable.
 */
function initScrollAnimations() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !("IntersectionObserver" in window)) return;

    const sections = document.querySelectorAll("main > .section");
    sections.forEach(section => {
        section.classList.add("scroll-reveal");
        section.querySelectorAll(".project-card, .journey-step").forEach((card, index) => {
            card.classList.add("card-reveal");
            card.style.setProperty("--card-delay", `${index * 120}ms`);
        });
    });

    const tiles = document.querySelectorAll(".skill-tile");
    tiles.forEach(tile => tile.classList.add("skill-reveal"));
    document.documentElement.classList.add("motion-ready");

    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const visible = entry.isIntersecting;
            entry.target.classList.toggle("is-visible", visible);
            entry.target.querySelectorAll(".card-reveal").forEach(card => {
                card.classList.toggle("is-visible", visible);
            });
        });
    }, { threshold: 0, rootMargin: "-10% 0px -10% 0px" });
    sections.forEach(section => sectionObserver.observe(section));

    const tileObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
    }, { threshold: 0.05, rootMargin: "0px 0px -20px 0px" });
    tiles.forEach(tile => tileObserver.observe(tile));

    // Switching tabs makes newly unhidden tiles eligible for fresh reveals.
    document.querySelectorAll("[data-skill-filter]").forEach(tab => {
        tab.addEventListener("click", () => {
            const active = document.querySelector(`[data-skill-group="${tab.dataset.skillFilter}"]`);
            active?.querySelectorAll(".skill-tile").forEach(tile => {
                tile.classList.add("is-visible");
            });
        });
    });
}


/**
 * Build an email draft using validated form values.
 * GitHub Pages hosts static files only: no server submission is claimed.
 * Users must explicitly send the draft in their own email application.
 */
function initContactForm() {
    const form = document.querySelector("#contact-form");
    const feedback = document.querySelector("#contact-form-feedback");
    if (!form) return;

    form.addEventListener("submit", event => {
        if (!form.reportValidity()) {
            event.preventDefault();
            return;
        }

        event.preventDefault();
        const fields = new FormData(form);
        const name = String(fields.get("name") || "").trim();
        const email = String(fields.get("email") || "").trim();
        const subject = String(fields.get("subject") || "").trim();
        const message = String(fields.get("message") || "").trim();
        if (!name || !email || !subject || message.length < 10) return;

        const body = `Name: ${name}\nReply-to: ${email}\n\n${message}`;
        const draftUrl = `mailto:zm4883179@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        if (feedback) feedback.textContent = "Your email app should open with a prepared draft. Please review it and press Send there. If it does not open, use the email link on the left.";
        window.location.href = draftUrl;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initNavigation();
    initSkills();
    initScrollAnimations();
    initContactForm();
});
