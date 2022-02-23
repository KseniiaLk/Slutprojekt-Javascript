let persons = [];
let page = 0;

document.querySelector(".characters ul").addEventListener('click', function (e) {
    const active = document.querySelector(".active");
    const arrow = document.querySelector(".characters ul li i");
    const push = document.querySelector(".push");

    const id = e.target.getAttribute("characterId");
    if (id % 2 === 0) {
        e.target.style.color = "white";
    }
    if (active) {
        active.classList.remove('active');
    }
    if (arrow) {
        arrow.remove();
    }
    if (push) {
        push.classList.remove('push');
    }
    let iElement = document.createElement("i");
    iElement.setAttribute("class", "fas fa-caret-right fa-1x");
    e.target.appendChild(iElement);

    e.target.classList.add('active');
    e.target.classList.add('push');
});

const fetchAllPersons = async function (index) {
    const persons = await (await fetch(`https://swapi.dev/api/people/?page=${index}`)).json();

    return persons.results;
}

window.onload = async function () {
    const ul = document.querySelector(".characters ul");

    for (let i = 1; i <= 9; i++) {
        persons = [...persons, ...await fetchAllPersons(i)]
    }

    const hasDecimal = (persons.length / 10) % 1;

    if (hasDecimal > 0) {
        document.querySelector(".pages").innerText = "1/" + Math.trunc((persons.length / 10) + 1);
    } else {
        document.querySelector(".pages").innerText = "1/" + Math.trunc((persons.length / 10));
    }

    if (persons) {
        document.getElementById('spinner').style.display = 'none';
        document.querySelector('.characters').style.display = 'block';

        for (let i = 0; i < page + 10; i++) {

            let li = document.createElement("li");
            li.setAttribute("characterId", i + 1);
            li.appendChild(document.createTextNode(persons[i].name));
            ul.appendChild(li);
        }
    };
    document.querySelector(".next").addEventListener("click", async () => {
        page == persons.length - 10 ? page = 0 : page += 10

        const nextPage = document.querySelector(".pages").innerText.split("/");
        if (nextPage[0] < nextPage[1]) {
            document.querySelector(".characters ul").innerHTML = "";
            document.querySelector(".detail-info").innerHTML = "";
            document.querySelector(".planet-info").innerHTML = "";

            document.querySelector(".pages").innerText = Number(nextPage[0]) + 1 + "/" + nextPage[1]

            if (nextPage[0] == 8) {
                for (let i = page; i < page + 2; i++) {
                    let li = document.createElement("li");
                    li.setAttribute("characterId", i + 1);
                    console.log(persons[i].name);
                    li.appendChild(document.createTextNode(persons[i].name));
                    ul.appendChild(li);
                }
            } else {
                for (let i = page; i < page + 10; i++) {
                    let li = document.createElement("li");
                    li.setAttribute("characterId", i + 1);
                    console.log(persons[i].name);
                    li.appendChild(document.createTextNode(persons[i].name));
                    ul.appendChild(li);
                }
            }
        }
    });
    document.querySelector(".previous").addEventListener("click", async () => {
        page == 0 ? (page = persons.length - 10) : (page -= 10)

        const nextPage = document.querySelector(".pages").innerText.split("/");

        if (nextPage[0] > 1) {
            document.querySelector(".characters ul").innerHTML = "";
            document.querySelector(".detail-info").innerHTML = "";
            document.querySelector(".planet-info").innerHTML = "";

            document.querySelector(".pages").innerText = Number(nextPage[0]) - 1 + "/" + nextPage[1];

            if (persons) {
                for (let i = page; i < page + 10; i++) {
                    let li = document.createElement("li");
                    li.setAttribute("characterId", i + 1);
                    console.log(persons[i]);
                    li.appendChild(document.createTextNode(persons[i].name));
                    ul.appendChild(li);
                }
            };
        }
    });

};
document.querySelector(".characters").addEventListener("click", async function (e) {
    const id = e.target.getAttribute("characterId");
    document.getElementById("spinner-detail").style.display = 'flex';
    document.getElementById("spinner-planet").style.display = 'flex';

    const person = persons[id - 1];
    const planet = await (await fetch(`https://swapi.dev/api/planets/${id}`)).json();

    let detailsUl = document.querySelector(".detail ul");
    detailsUl.innerHTML = "";
    document.getElementById("spinner-detail").style.display = 'none';

    let modifiedPerson = (({ name, height, mass, hair_color, skin_color, eye_color, birth_year, gender }) => ({ name, height, mass, hair_color, skin_color, eye_color, birth_year, gender }))(person);

    for (const key in modifiedPerson) {
        let li = document.createElement("li");
        if (key == 'name') {
            li.appendChild(document.createTextNode(person[key]));
            li.setAttribute("class", "largetext");
        } else if (key == "height") {
            li.appendChild(document.createTextNode(key.charAt(0).toUpperCase() + key.slice(1) + ": " + person[key] + " cm"));
        } else if (key == "mass") {
            li.appendChild(document.createTextNode(key.charAt(0).toUpperCase() + key.slice(1) + ": " + person[key] + " kg"));
        } else {
            li.appendChild(document.createTextNode(key.charAt(0).toUpperCase() + key.slice(1) + ": " + person[key]));
        }
        if (li.className) {
            li.setAttribute("class", "detail-info" + " " + li.className);
        } else {
            li.setAttribute("class", `detail-info`)
        }
        detailsUl.appendChild(li);
    }

    if (planet) {
        let planetUl = document.querySelector(".planet ul");
        planetUl.innerHTML = "";
        document.getElementById("spinner-planet").style.display = 'none';

        let modifiedPlanet = (({ name, rotation_period, orbital_period, diameter, climate, gravity, terrain }) => ({ name, rotation_period, orbital_period, diameter, climate, gravity, terrain }))(planet);

        for (const key in modifiedPlanet) {
            let li = document.createElement("li");
            if (key == 'name') {
                li.appendChild(document.createTextNode(planet[key]));
                li.setAttribute("class", "largetext")
            } else if (key == "rotation_period") {
                li.appendChild(document.createTextNode(key.charAt(0).toUpperCase() + key.slice(1) + ": " + planet[key] + " h"));
            } else if (key == "orbital_period") {
                li.appendChild(document.createTextNode(key.charAt(0).toUpperCase() + key.slice(1) + ": " + planet[key] + " days"));
            } else if (key == "diameter") {
                li.appendChild(document.createTextNode(key.charAt(0).toUpperCase() + key.slice(1) + ": " + planet[key] + " km"));
            } else {
                li.appendChild(document.createTextNode(key.charAt(0).toUpperCase() + key.slice(1) + ": " + planet[key]));
            }
            if (li.className) {
                li.setAttribute("class", "planet-info" + " " + li.className)
            } else {
                li.setAttribute("class", `planet-info`)
            }
            planetUl.appendChild(li);

        }
    }
});