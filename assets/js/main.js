const story = document.querySelector("#story");
const track = document.querySelector("#track");
const moto = document.querySelector("#moto");
const panels = Array.from(track.querySelectorAll(".panel"));
const lavaBackground = document.querySelector(".lava-background");
const scrollTrail = document.querySelector(".scroll-trail");
let frame = 0;

function updateSlide() {
    frame = 0;
    const distance = story.offsetHeight - window.innerHeight;
    const traveled = Math.min(Math.max(window.scrollY - story.offsetTop, 0), distance);
    const entrada = Math.min(Math.max(traveled / (window.innerHeight * 0.7), 0), 1);
    const entradaSuave = entrada * entrada * (3 - 2 * entrada);
    const avanceHorizontal = Math.min(
        Math.max((traveled - window.innerHeight) / (distance - window.innerHeight), 0),
        1
    );

    const escalaSalida = 1 - (1 - avanceHorizontal) * (1 - avanceHorizontal);
    const escalaMoto = 0.86 + entradaSuave * 0.1 - escalaSalida * 0.08;

    moto.style.transform = `translate3d(${(entradaSuave - 1) * 115}%, 0, 0) scale(${escalaMoto})`;
    moto.style.opacity = "1";
    lavaBackground.style.transform = `scale(${1.12 - entradaSuave * 0.12 + escalaSalida * 0.08}) translate3d(0, ${escalaSalida * -4}%, 0)`;
    scrollTrail.style.opacity = `${1 - entradaSuave}`;

    panels.forEach((panel, index) => {
        const progreso = Math.min(Math.max(avanceHorizontal * (panels.length - 1) - index, 0), 1);
        const compresion = progreso * progreso * (3 - 2 * progreso);
        const desvanecer = Math.min(Math.max((progreso - 0.72) / 0.28, 0), 1);

        panel.style.transform = `scale(${1 - compresion * 0.28}, ${1 - compresion * 0.78}) translate3d(0, ${compresion * -8}%, 0)`;
        panel.style.opacity = `${1 - desvanecer}`;
    });

    track.style.transform = `translate3d(${-avanceHorizontal * 200}vw, 0, 0)`;
}

function requestSlideUpdate() {
    if (!frame) {
        frame = window.requestAnimationFrame(updateSlide);
    }
}

window.addEventListener("scroll", requestSlideUpdate, { passive: true });
window.addEventListener("resize", requestSlideUpdate);

document.querySelectorAll("[data-slide]").forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        const slide = Number(link.dataset.slide);
        window.scrollTo({
            top: story.offsetTop + (slide ? (slide + 1) * window.innerHeight : 0),
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
        });
    });
});

updateSlide();
