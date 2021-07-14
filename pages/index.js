import React from 'react'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'

function ProfileSidebar(propriedades) {
	// console.log(propriedades)
	return (
		<Box as='aside'>
			<img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
			<hr />
			<p>
				<a className='boxLink' href={`https://github.com/${propriedades.githubUser}`}>
					<h4>	@{propriedades.githubUser}</h4>
				</a>
			</p>
			<hr />

			<AlurakutProfileSidebarMenuDefault />
		</Box>
	)
}

function ProfileRelationsBox(propriedades) {
	const listaSeguidores = propriedades.items.slice(0, 6)
	return (
		<ProfileRelationsBoxWrapper>
			<h2 className='smallTitle'>
				{propriedades.title} ({propriedades.items.length})
			</h2>
			<ul>
				{
					listaSeguidores.map((seguidor) => {
						return (
							<li key={seguidor.id}>
								<a href={`https://github.com/${seguidor.login}`}>
									<img src={seguidor.avatar_url} />
									<span>{seguidor.login}</span>
								</a>
							</li>
						)
					})
				}
			</ul>
		</ProfileRelationsBoxWrapper>
	)
}

export default function Home() {
	// const comunidades = React.useState(['Alurakut'])
	const usuarioAleatorio = 'franciscorodrigues'
	const [comunidades, setComunidades] = React.useState([{
		id: '1234567890',
		title: 'Eu odeio acordar cedo',
		image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
	},
	{
		id: '0987654321',
		title: 'Mengão eterno',
		image: 'https://logodetimes.com/times/flamengo/logo-flamengo-512.png'
	}])
	// const comunidades = ['Alurakut']
	// const alteradorDeComunidades/setComunidades = comunidades[1];

	const pessoasFavoritas = [
		'cleuton',
		'humbertopacheco',
		'shykes',
		'juunegreiros',
		'omariosouto',
		'peas',
		'rafaballerini'
	]
	const pessoasFavs = pessoasFavoritas.slice(0, 6)

	const [seguidores, setSeguidores] = React.useState([])
	// 0 - Pegar os ados do github
	React.useEffect(function () {
		fetch('https://api.github.com/users/cleuton/followers')
			.then(function (respostaDoServidor) {
				return respostaDoServidor.json()
			})
			.then(function (respostaCompleta) {
				setSeguidores(respostaCompleta)
			})
	}, [])

	// console.log('seguidores antes do return', seguidores)
	return (
		<>
			<AlurakutMenu />
			<MainGrid>
				{/* <Box style="grid-area: profileArea;"> */}
				<div className='profileArea' style={{ gridArea: 'profileArea' }}>
					<ProfileSidebar githubUser={usuarioAleatorio} />
				</div>
				<div className='welcomeArea' style={{ gridArea: 'welcomeArea' }}>
					<Box>
						<h1 className='title'>
							Bem vindo(a)
						</h1>
						<OrkutNostalgicIconSet />
					</Box>
					<Box>
						<h2>O que você deseja fazer?</h2>
						<form onSubmit={function handleCriaComunidade(e) {
							e.preventDefault()
							const dadosDoForm = new FormData(e.target)

							// console.log('Campo: ', dadosDoForm.get('title'))
							// console.log('Campo: ', dadosDoForm.get('image'))

							const comunidade = {
								id: new Date().toISOString(),
								title: dadosDoForm.get('title'),
								image: dadosDoForm.get('image')
							}
							const comunidadesAtualizadas = [...comunidades, comunidade]
							setComunidades(comunidadesAtualizadas)
						}}
						>
							<div>
								<input
									placeholder='Qual vai ser o nome da sua comunidade?'
									name='title'
									aria-label='Qual vai ser o nome da sua comunidade?'
									type='text'
								/>
							</div>
							<div>
								<input
									placeholder='Coloque uma URL para usarmos de capa'
									name='image'
									aria-label='Coloque uma URL para usarmos de capa'
								/>
							</div>

							<button>
								Criar comunidade
							</button>
						</form>
					</Box>
				</div>
				<div className='profileRelationsArea' style={{ gridArea: 'profileRelationsArea' }}>
					<ProfileRelationsBox title='Seguidores' items={seguidores} />
					<ProfileRelationsBoxWrapper>
						<h2 className='smallTitle'>
							Comunidades ({comunidades.length})
						</h2>
						<ul>
							{comunidades.map((itemAtual) => {
								return (
									<li key={itemAtual.id}>
										<a href={`/users/${itemAtual.title}`}>
											<img src={itemAtual.image} />
											<span>{itemAtual.title}</span>
										</a>
									</li>
								)
							})}
						</ul>
					</ProfileRelationsBoxWrapper>
					<ProfileRelationsBoxWrapper>
						<h2 className='smallTitle'>
							Pessoas da comunidade ({pessoasFavoritas.length})
						</h2>
						<ul>
							{pessoasFavs.map((itemAtual) => {
								return (
									<li>
										<a href={`https://github.com/${itemAtual}`} key={itemAtual}>
											<img src={`https://github.com/${itemAtual}.png`} />
											<span>{itemAtual}</span>
										</a>
									</li>
								)
							})}
						</ul>
					</ProfileRelationsBoxWrapper>
				</div>
			</MainGrid>
		</>
	)
}
