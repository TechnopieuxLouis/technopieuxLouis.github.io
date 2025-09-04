/*
 * Modal
 *
 * Pico.css - https://picocss.com
 * Copyright 2019-2024 - Licensed under MIT
 */

// Config
const isOpenClass = "modal-is-open";
const openingClass = "modal-is-opening";
const closingClass = "modal-is-closing";
const scrollbarWidthCssVar = "--pico-scrollbar-width";
const animationDuration = 400; // ms
let visibleModal = null;

// Toggle modal
const toggleModal = (event) => {
    event.preventDefault();
    const modal = document.getElementById(event.currentTarget.dataset.target);
    if (!modal) return;
    modal && (modal.open ? closeModal(modal) : openModal(modal));
};

const navigateModal = async (event) => {
    event.preventDefault();
    const currentId = event.currentTarget.dataset.target;
    const nextId = event.currentTarget.dataset.navigate; // modal de destination

    const modal = document.getElementById(currentId);
    const modalNext = document.getElementById(nextId);

//    console.log(currentId, nextId);
    if (!modal || !modalNext) return;

    await closeModal(modal);
    openModal(modalNext);
};

// Open modal
const openModal = (modal) => {
    const {documentElement: html} = document;
    const scrollbarWidth = getScrollbarWidth();
    if (scrollbarWidth) {
        html.style.setProperty(scrollbarWidthCssVar, `${scrollbarWidth}px`);
    }
    html.classList.add(isOpenClass, openingClass);
    setTimeout(() => {
        visibleModal = modal;
        html.classList.remove(openingClass);
    }, animationDuration);
    modal.showModal();
};

// Close modal
const closeModal = (modal) => {
    return new Promise((resolve) => {
        visibleModal = null;
        const {documentElement: html} = document;
        html.classList.add(closingClass);
        setTimeout(() => {
            html.classList.remove(closingClass, isOpenClass);
            html.style.removeProperty(scrollbarWidthCssVar);
            modal.close();
            resolve();
        }, animationDuration);
    });
};

// Close with a click outside
document.addEventListener("click", (event) => {
    if (visibleModal === null) return;
    const modalContent = visibleModal.querySelector("article");
    const isClickInside = modalContent.contains(event.target);
    !isClickInside && closeModal(visibleModal);
});

// Close with Esc key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && visibleModal) {
        closeModal(visibleModal);
    }
});

// Get scrollbar width
const getScrollbarWidth = () => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    return scrollbarWidth;
};

// Is scrollbar visible
const isScrollbarVisible = () => {
    return document.body.scrollHeight > screen.height;
};
