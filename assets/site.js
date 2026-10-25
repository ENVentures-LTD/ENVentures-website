/* Browser-side enhancements. The document remains useful without this file. */
(() => {
    "use strict";

    function initNavigation() {
        const root = document.querySelector(".nav");
        const button = root?.querySelector("[data-menu-toggle]");
        const links = root?.querySelector("#primary-links");
        if (!root || !button || !links || typeof window.matchMedia !== "function") return;
        const label = button.querySelector("[data-menu-label]");
        const mobile = window.matchMedia("(max-width: 560px)");
        let open = false;
        function sync() {
            if (!mobile.matches) open = false;
            button.hidden = !mobile.matches;
            links.hidden = mobile.matches && !open;
            button.setAttribute("aria-expanded", String(mobile.matches && open));
            if (label) label.textContent = open ? "Close" : "Menu";
        }
        function close(restoreFocus = false) {
            open = false;
            sync();
            if (restoreFocus && mobile.matches) button.focus();
        }
        button.addEventListener("click", () => { open = !open; sync(); });
        root.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && open) { event.preventDefault(); close(true); }
        });
        links.addEventListener("click", (event) => {
            if (mobile.matches && event.target.closest("a")) close();
        });
        document.addEventListener("click", (event) => {
            if (open && !root.contains(event.target)) close();
        });
        if (mobile.addEventListener) mobile.addEventListener("change", sync);
        else mobile.addListener(sync);
        root.dataset.menuReady = "";
        sync();
    }

    function initApproach() {
        for (const root of document.querySelectorAll("[data-approach]")) {
            const list = root.querySelector("[data-approach-tabs]");
            const tabs = [...(list?.querySelectorAll('[role="tab"]') ?? [])];
            const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));
            if (!list || !tabs.length || panels.some((panel) => !panel || !root.contains(panel))) continue;
            function activate(index, focus = false) {
                tabs.forEach((tab, i) => {
                    const selected = i === index;
                    tab.setAttribute("aria-selected", String(selected));
                    tab.tabIndex = selected ? 0 : -1;
                    panels[i].hidden = !selected;
                });
                root.dataset.stage = tabs[index].dataset.stage;
                if (focus) tabs[index].focus();
            }
            tabs.forEach((tab, index) => {
                panels[index].setAttribute("role", "tabpanel");
                panels[index].setAttribute("aria-labelledby", tab.id);
                panels[index].tabIndex = 0;
                tab.addEventListener("click", () => activate(index));
                tab.addEventListener("keydown", (event) => {
                    const next = { ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index - 1 + tabs.length) % tabs.length, Home: 0, End: tabs.length - 1 }[event.key];
                    if (next !== undefined) { event.preventDefault(); activate(next, true); }
                });
            });
            root.classList.add("is-interactive");
            activate(0);
            list.hidden = false;
        }
    }

    function initEmailCopy() {
        const root = document.querySelector("[data-email-contact]");
        const button = root?.querySelector("[data-copy-email]");
        const link = root?.querySelector("[data-email-link]");
        const status = root?.querySelector("[data-copy-status]");
        const fallback = root?.querySelector("[data-copy-fallback]");
        const input = fallback?.querySelector("input");
        if (!button || !link || !status || !fallback || !input) return;
        const email = link.getAttribute("href")?.replace(/^mailto:/i, "").split("?")[0];
        if (!email) return;
        let busy = false;
        button.hidden = false;
        button.addEventListener("click", async () => {
            if (busy) return;
            busy = true;
            status.textContent = "";
            button.setAttribute("aria-busy", "true");
            try {
                if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
                await navigator.clipboard.writeText(email);
                fallback.hidden = true;
                status.textContent = "Email address copied.";
            } catch {
                input.value = email;
                fallback.hidden = false;
                status.textContent = "Copy the email address below.";
                input.focus();
                input.select();
            } finally {
                busy = false;
                button.removeAttribute("aria-busy");
            }
        });
    }

    function initReveals() {
        if (!("IntersectionObserver" in window) || typeof window.matchMedia !== "function" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                entry.target.classList.add("is-revealed");
                observer.unobserve(entry.target);
            }
        }, { threshold: 0.08 });
        for (const section of document.querySelectorAll(".company-statement, .portfolio-directory, .company-record, .portfolio-entry, .contact-directory")) {
            section.dataset.reveal = "";
            observer.observe(section);
        }
    }

    initNavigation();
    initApproach();
    initEmailCopy();
    initReveals();
})();
