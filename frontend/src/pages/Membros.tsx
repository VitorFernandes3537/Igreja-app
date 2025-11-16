// declara e exporta em função padrão, onde permite importar sem precisar colocar {},
// um componente React do tipo função, a function nomeado, por conveção começa com letra máiusculas (PascalCase)

export default function Membros() {
  // aqui toda a função react precisa retornar o será renderizado na tela
  // o retorno é feito em JSX (JavaScript + XML) isso é o que transforma funções JS em "telas visuais"
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-2xl font-bold">Membros</h1>
      <p className="opacity-80 mt-2">Lista/CRUD virá aqui</p>
    </div>
  )
}


/* div parte principal da página o container raiz
            tailwindcss:
                min-h-screen: garante que a altura mínuma seja a altura da tela, tomando o fundo completo
                bg-slate-900: define a cor do fundo em um tom cinza-escuro
                text-white: defina o texto branco
                p-8: padding (espaçamento interno) de 2rem (~32px) criando um respiro entre o conteúdo e as bordas
                text-2x1: cria um texto título com o dobro do tamanho
                font-bold: define o peso do título para 700 (negrito)
                opacity-80: cria com um visual mais confortável, competindo menos com o título
                mt-2: é uma margem topo de respiro, entre o título e o texto abaixo
            o p aqui está como "placeholder" uma dica de onde vai o conteúdo real quando implementado 
        */