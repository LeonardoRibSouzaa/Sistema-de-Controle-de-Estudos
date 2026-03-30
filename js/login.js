function logar(){
    const form = document.getElementById('login_form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        //pegar os dados do form
        const formData = new FormData(form);

        //transforma em objeto
        const data = Object.fromEntries(formData.entries());
        console.log("usuario ",data.usuario," fez login"); // {nome: "Leo", email: "leo@email.com"}

        localStorage.setItem("usuario", data.usuario)

        window.location.href = window.location.origin + "/menu.html";



    })

}

logar();