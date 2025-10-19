// uma função que retorna um JSX a "arvoré" de elemento da UI
// o export padrão do arquivo, no caso, quem import não precisa utilizar "{}"
export default function Dashboard() {
  // guarda em user o string do usuário algo assim {id: "1", nome: "joao", email: "joao@email.com"}
  const user = localStorage.getItem('user')
  // aqui utilizando um if ternário se o user existir então "parseia" tranforsma o string em objeto json novamente
  // caso não, então o user = null
  const me = user ? JSON.parse(user) : null
  // a partir daqui se contruirá o objeto JSX a UI(interface) explicação abaixo e classes usados
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <header className="flex items-center justify-center">
        <h1 className="font-bold min-w-screen justify-between">Dashboard Teste</h1>
        <div className="flex items-center gap-3">
          <span className="opacity-80">{me?.nome}</span>
          <button
            className="bg-rose-500 text-white px-3 py-1 hover:bg-rose-600 transition-colors"
            onClick={() => {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              window.location.href = '/login'
            }}
          >
            Sair
          </button>
        </div>
      </header>
      <p className="mt-6 opacity-80">Bem-vindo ao App adbrás.</p>
    </div>
  )
}

/*  
    - div: raiz do continer de página
    - className: em React é className e não class
    Tailwind classes:
        min-h-screen: altura mínima = altura da viewport (página "cheia").
        bg-slate-900: fundo cinza-escuro quser preto (tema dark)
        text-white: texto em branco por padrão
        px-8: padding(espaçamento interno) de 2rem o que cada 1 rem = 1 unidade (4 * 8 = 32px)
    - header: semântico: região do topo.
    TailWind:
        flex: ativa flexbox. (organiza o que vier dentro lado a lado) 
        items-center: alinha itens no eixo cruzado (vertical) ao centro.
        justify-between: espaço máximo entre os dois lados(título á esquerda, ações á direita)
        gap-3: cria um espaçamento consistente entre elementos
        opacity-80: visual mais suave, opacidade mais fraca, para não competir com o título
        mt-6: margem topo, margem de respiro para não ficar colado no bloco anterior
    span: inline elemento para texto, só ocupa o espaço do seu conteúdo mas se mantém na mesma linha(inline)
    onClick: prop que ativa um função dentro da linha onde é usada.
    localStorage.clear(): apaga tudo do domínio não só token/user
    window.location.href = '/login': alternativa SPA para useNavigate() do react-router-dom para não recarregar a página
    /login = navegação full page para login.  
*/
