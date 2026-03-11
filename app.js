// =============================
// CONFIGURAÇÃO FIREBASE
// =============================

const firebaseConfig = {

apiKey:"SUA_API",
authDomain:"SEUAPP.firebaseapp.com",
projectId:"SEUAPP"

}

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()

const db = firebase.firestore()



// =============================
// VARIÁVEIS DO APP
// =============================

let dados = []

let grafico



// =============================
// LOGIN
// =============================

function login(){

let email = document.getElementById("email").value
let senha = document.getElementById("senha").value

auth.signInWithEmailAndPassword(email,senha)

.then(()=>{

alert("Login realizado")

})

.catch((erro)=>{

alert(erro.message)

})

}



// =============================
// CRIAR CONTA
// =============================

function registrar(){

let email = document.getElementById("email").value
let senha = document.getElementById("senha").value

auth.createUserWithEmailAndPassword(email,senha)

.then(()=>{

alert("Conta criada")

})

.catch((erro)=>{

alert(erro.message)

})

}



// =============================
// LOGOUT
// =============================

function logout(){

auth.signOut()

}



// =============================
// VERIFICAR USUÁRIO
// =============================

auth.onAuthStateChanged(user=>{

if(user){

document.getElementById("login").classList.add("hidden")
document.getElementById("app").classList.remove("hidden")

sincronizar(user.uid)

}else{

document.getElementById("login").classList.remove("hidden")
document.getElementById("app").classList.add("hidden")

}

})



// =============================
// SINCRONIZAÇÃO AUTOMÁTICA
// =============================

function sincronizar(uid){

db.collection("financas").doc(uid)

.onSnapshot(doc=>{

if(doc.exists){

dados = doc.data().dados

}else{

dados = []

}

atualizar()

})

}



// =============================
// SALVAR DADOS
// =============================

function salvar(){

let uid = auth.currentUser.uid

db.collection("financas").doc(uid).set({

dados:dados

})

}



// =============================
// RECEITA
// =============================

function addReceita(){

let valor = Number(document.getElementById("valorReceita").value)

dados.push({

tipo:"receita",
valor:valor,
data:new Date().toLocaleDateString()

})

salvar()

}



// =============================
// GASTO
// =============================

function addGasto(){

let valor = Number(document.getElementById("valorGasto").value)

let categoria = document.getElementById("categoria").value

if(categoria==="Outros"){

categoria = document.getElementById("categoriaOutro").value

}

dados.push({

tipo:"gasto",
valor:valor,
categoria:categoria,
data:new Date().toLocaleDateString()

})

salvar()

}



// =============================
// CAMPO OUTROS
// =============================

function mostrarOutro(){

let cat = document.getElementById("categoria").value

if(cat==="Outros"){

document.getElementById("categoriaOutro").classList.remove("hidden")

}else{

document.getElementById("categoriaOutro").classList.add("hidden")

}

}



// =============================
// ATUALIZAR DASHBOARD
// =============================

function atualizar(){

let saldo = 0
let receitas = 0
let gastos = 0

let categorias = {}

let lista = document.getElementById("historico")

lista.innerHTML=""

dados.forEach(item=>{

if(item.tipo==="receita"){

saldo+=item.valor
receitas+=item.valor

}else{

saldo-=item.valor
gastos+=item.valor

if(!categorias[item.categoria]){

categorias[item.categoria]=0

}

categorias[item.categoria]+=item.valor

}

let li=document.createElement("li")

li.innerHTML=`${item.data} ${item.tipo} R$${item.valor}`

lista.appendChild(li)

})

document.getElementById("saldo").innerText="R$"+saldo
document.getElementById("receitas").innerText="R$"+receitas
document.getElementById("gastos").innerText="R$"+gastos

desenharGrafico(categorias)

}



// =============================
// GRÁFICO
// =============================

function desenharGrafico(cat){

let ctx=document.getElementById("grafico")

if(grafico)grafico.destroy()

grafico=new Chart(ctx,{

type:"doughnut",

data:{

labels:Object.keys(cat),

datasets:[{

data:Object.values(cat)

}]

}

})

}



// =============================
// TEMA CLARO / ESCURO
// =============================

function trocarTema(){

document.body.classList.toggle("dark")

}
