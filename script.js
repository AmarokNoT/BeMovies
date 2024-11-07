const cards = document.querySelectorAll('.cards')
cards.forEach(el => {
    el.addEventListener("mouseover", () => {
        // console.log("c'est rentré")
        const infos = document.querySelector('.infos')
        infos.classList.add('hidden');
    })
});