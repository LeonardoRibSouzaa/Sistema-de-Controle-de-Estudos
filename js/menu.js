let disciplinas = JSON.parse(localStorage.getItem("disciplinas") || "[]");

function salvarDados(){
    localStorage.setItem('disciplinas', JSON.stringify(disciplinas));

}

function bindCadastro(){
    document.getElementById("form_cadastro").addEventListener("submit", (e) => {
        e.preventDefault();

        const nova = {
            nome: document.getElementById("inp_nome").value,
            professor: document.getElementById("inp_professor").value,
            carga: document.getElementById("inp_hora").value,
            area: document.getElementById("inp_area").value,
            horasEstudadas: 0
        }

        if (!nova.nome || !nova.professor || !nova.carga || !nova.area){
            alert("Preencha todos os campos!")
            return
        }

        disciplinas.push(nova)
        salvarDados();
        e.target.reset()
        alert(`"${nova.nome}" cadastrada com sucesso!`)

    })
}

function renderLista(){
    const cont = document.getElementById("lista_disciplinas");

    // Se não tiver nenhuma, mostra mensagem
    if (disciplinas.length === 0){
        cont.innerHTML = '<p class="msg_vazia">Nenhuma disciplina cadastrada.</p>'
        return;
    }



    cont.innerHTML = disciplinas.map((d, i) => {
        const progresso = Math.round((d.horasEstudadas / d.carga) * 100)

        return `
        <div>
            <strong>${d.nome}</strong> |
            ${d.professor} |
            ${d.area} |
            ${d.carga}h |
            Progresso: ${progresso}%
            <button onclick="excluir(${i})">Excluir</button>
            <button onclick="abrirEditar(${i})">Editar</button>
        </div>
    `
    }).join('')

}

function abrirEditar(idx) {
    const d = disciplinas[idx]

    // Preenche o modal com os dados da disciplina
    document.getElementById('edit_idx').value      = idx
    document.getElementById('edit_nome').value     = d.nome
    document.getElementById('edit_professor').value = d.professor
    document.getElementById('edit_carga').value    = d.carga
    document.getElementById('edit_area').value     = d.area

    // Mostra o modal
    document.getElementById('modal_editar').style.display = 'flex'
}

function fecharModal() {
    document.getElementById('modal_editar').style.display = 'none'
}

document.getElementById('form_editar').addEventListener('submit', (e) => {
    e.preventDefault()

    const idx = Number(document.getElementById('edit_idx').value)

    // Atualiza a disciplina no array
    disciplinas[idx].nome      = document.getElementById('edit_nome').value
    disciplinas[idx].professor = document.getElementById('edit_professor').value
    disciplinas[idx].carga     = Number(document.getElementById('edit_carga').value)
    disciplinas[idx].area      = document.getElementById('edit_area').value

    salvarDados()
    fecharModal()
    renderLista()
})

function excluir(idx) {
    const confirma = confirm(`Deseja excluir "${disciplinas[idx].nome}"?`)

    if (!confirma) return

    disciplinas.splice(idx, 1)
    salvarDados()
    renderLista()
}

function bindHoras(){

    // Preenche o select com as disciplinas salvas
    const sel = document.getElementById("inp_disciplina")
    sel.innerHTML = '<option value="" disabled selected> Selecione...</option>'

    disciplinas.forEach((d,i) =>{
        sel.innerHTML += `<option value="${i}">${d.nome}</option>`
    })

    document.getElementById("form_horas").addEventListener("submit", (e) => {
        e.preventDefault();

        const idx = Number(document.getElementById("inp_disciplina").value);
        const horas = Number(document.getElementById("inp_horas").value);

        disciplinas[idx].horasEstudadas += horas;
        salvarDados()
        e.target.reset()
        alert(`${horas}h registradas em "${disciplinas[idx].nome}"!`)

    })

}

function renderDashboard(){
    disciplinas = JSON.parse(localStorage.getItem("disciplinas") || "[]");
    total_disciplinas = disciplinas.length;


    horasEstudadas = disciplinas.reduce((total, disciplina) => total + disciplina.horasEstudadas, 0)

    total_disc = document.getElementById("total_disc")
    total_horas = document.getElementById("total_horas")

    total_disc.innerHTML = `${total_disciplinas}`
    total_horas.innerHTML = `${horasEstudadas}`


}


function bindControls(){
    document.querySelectorAll('.sidebar_item').forEach(item =>{
        item.addEventListener('click', ()=>{

            document.querySelectorAll('.sidebar_item').forEach(i =>{
                i.classList.remove('active');
            })

            item.classList.add('active');

            document.querySelectorAll('.content_section').forEach(section =>{
                section.classList.remove('active');
            })

            const qual = item.dataset.section

            document.getElementById('section_'+qual).classList.add('active');

            switch (qual){
                case "diciplinas":
                    renderLista()
                    break;
                case "horas":
                    bindHoras()
                    break;
                case "dashboard":
                    renderDashboard()
                    break;
            }



        })
    })
}

function init(){
    bindControls()
    bindCadastro()
    renderDashboard()

}
init();