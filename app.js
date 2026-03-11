// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDta-NeJnd-9IVVjsJWE-VF1CYwm1FLK9c",
  authDomain: "deliciacity-df6cf.firebaseapp.com",
  databaseURL: "https://deliciacity-df6cf-default-rtdb.firebaseio.com",
  projectId: "deliciacity-df6cf",
  storageBucket: "deliciacity-df6cf.appspot.com",
  messagingSenderId: "1087217649656",
  appId: "1:1087217649656:web:712786d04ec1f3be33380d"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

let uid=null;
let dados=[];
let grafico=null;

// mantém tema salvo
if(localStorage.getItem("tema")=="dark"){
  document.body.classList.add("dark")
}

// Listener de autenticação
auth.onAuthStateChanged(user=>{
  if(user){
    uid=user.uid;
    document.getElementById("emailUser").innerText=user.email;
    document.getElementById("login").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    carregar();
  }
});

// Registrar
function registrar(){
  let email=document.getElementById("email").value;
  let senha=document.getElementById("senha").value;
  auth.createUserWithEmailAndPassword(email,senha)
    .then(()=>alert("Conta criada"))
    .catch(e=>alert(e.message));
}

// Login
function login(){
  let email=document.getElementById("email").value;
  let senha=document.getElementById("senha").value;
  auth.signInWithEmailAndPassword(email,senha)
    .catch(()=>alert("Erro no login"));
}

// Logout
function logout(){
  auth.signOut();
  location.reload();
}

// Tema claro/escuro
function tema(){
  document.body.classList.toggle("dark");
  if(document.body.classList.contains("dark")){
    localStorage.setItem("tema","dark")
  }else{
    localStorage.setItem("tema","light")
  }
}

// Adicionar receita
function addReceita(){
  if(!uid) return;
  let valor=Number(document.getElementById("receitaValor").value);
  if(!valor) return alert("Digite um valor");
  let item={tipo:"receita",valor:valor,data:new Date().toLocaleDateString()};
  db.ref("dados/"+uid).push(item);
}

// Adicionar gasto
function addGasto(){
  if(!uid) return;
  let valor=Number(document.getElementById("gastoValor").value);
  let cat=document.getElementById("categoria").value;
  if(!valor) return alert("Digite um valor");
  let item={tipo:"gasto",valor:valor,categoria:cat,data:new Date().toLocaleDateString()};
  db.ref("dados/"+uid).push(item);
}

// Deletar transação
function deletar(id){
  db.ref("dados/"+uid+"/"+id).remove();
}

// Carregar dados
function carregar(){
  db.ref("dados/"+uid).on("value",snap=>{
    dados=[];
    let lista=document.getElementById("lista");
    lista.innerHTML="";
    snap.forEach(i=>{
      let d=i.val();
      let key=i.key;
      dados.push(d);
      let li=document.createElement("li");
      li.innerHTML=`<span>${d.data} R$${d.valor}</span><button class="del" onclick="deletar('${key}')">Apagar</button>`;
      lista.appendChild(li);
    });
    atualizar();
  });
}

// Atualizar saldo e gráfico
function atualizar(){
  let saldo=0;
  let categorias={};
  dados.forEach(d=>{
    if(d.tipo==="receita"){saldo+=d.valor}
    else{
      saldo-=d.valor;
      if(!categorias[d.categoria]) categorias[d.categoria]=0;
      categorias[d.categoria]+=d.valor;
    }
  });
  document.getElementById("saldo").innerText="R$"+saldo.toFixed(2);
  graficoFunc(categorias);
}

// Gráfico
function graficoFunc(cat){
  let ctx=document.getElementById("grafico");
  if(grafico) grafico.destroy();
  grafico=new Chart(ctx,{
    type:"pie",
    data:{labels:Object.keys(cat),datasets:[{data:Object.values(cat)}]}
  });
}
