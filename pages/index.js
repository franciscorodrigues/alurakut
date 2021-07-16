import React from 'react'
import nookies from 'nookies'
import jwt from 'jsonwebtoken'
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

export default function Home(props) {
	// const comunidades = React.useState(['Alurakut'])
	const usuarioAleatorio = props.githubUser // == null ? 'franciscorodrigues' : props.githubUser
	const [comunidades, setComunidades] = React.useState([])

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

	const [comentarios, setComentarios] = React.useState([])
	const [seguidores, setSeguidores] = React.useState([])

	// 0 - Pegar os dados do github
	React.useEffect(function () {
		fetch('https://api.github.com/users/cleuton/followers')
			.then(function (respostaDoServidor) {
				return respostaDoServidor.json()
			})
			.then(function (respostaCompleta) {
				setSeguidores(respostaCompleta)
			})

		// API GraphQL - comunidades
		fetch('https://graphql.datocms.com/', {
			method: 'POST',
			headers: {
				Authorization: 'f57d263efe914e2e12f8e509798426',
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify({
				query: `query {
					allCommunities {
						id 
						title
						imageUrl
						creatorSlug
					}
					}`
			})
		})
			.then((response) => response.json())
			.then((respostaCompleta) => {
				const comunidadesVindasDoDato = respostaCompleta.data.allCommunities
				// console.log(comunidadesVindasDoDato)
				setComunidades(comunidadesVindasDoDato)
			})

		// comentarios
		fetch('https://graphql.datocms.com/', {
			method: 'POST',
			headers: {
				Authorization: 'f57d263efe914e2e12f8e509798426',
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify({
				query: `query {
					      allComments  {
							usuario 
							scraps
						  }
				}`
			})
		})
			.then((response) => response.json())
			.then((response) => {
				const comentariosVindosDoDato = response.data.allComments
				// console.log('comentariosVindosDoDato ' + comentariosVindosDoDato)
				setComentarios(comentariosVindosDoDato)
			})
	}, [])

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
							Bem vindo(a), {usuarioAleatorio}!
						</h1>
						<OrkutNostalgicIconSet />
					</Box>
					<Box>
						<h2>O que você deseja fazer?</h2>
						<form onSubmit={function handleCriaComunidade(e) {
							e.preventDefault()
							const dadosDoForm = new FormData(e.target)

							const comunidade = {
								title: dadosDoForm.get('title'),
								imageUrl: dadosDoForm.get('image'),
								creatorSlug: usuarioAleatorio
							}

							fetch('/api/comunidades', {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json'
								},
								body: JSON.stringify(comunidade)
							})
								.then(async (response) => {
									const dados = await response.json()
									// console.log(dados.registroCriado)
									const comunidade = dados.registroCriado
									const comunidadesAtualizadas = [...comunidades, comunidade]
									setComunidades(comunidadesAtualizadas)
								})
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
					<Box>
						<h2>Comentários ({comentarios.length})</h2>
						<form onSubmit={(e) => {
							e.preventDefault()
							const dadosDoForm = new FormData(e.target)

							const comentario = {
								usuario: dadosDoForm.get('usuario'),
								scraps: dadosDoForm.get('scraps')
							}
							//limpar campos
							e.target[0].value = ''
							e.target[1].value = ''

							fetch('/api/comentarios', {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json'
								},
								body: JSON.stringify(comentario)
							})
								.then(async (response) => {
									const dados = await response.json()
									const comentario = dados.registroCriado
									const comentariosAtuais = [...comentarios, comentario]
									setComentarios(comentariosAtuais)
								})
						}}
						>
							<div>
								<input
									placeholder='Entre com o nome do usuário'
									name='usuario'
									aria-label='Qual vai ser o nome do usuário?'
									type='text'
								/>
							</div>
							<div>
								<input
									placeholder='Entre com um comentário'
									name='scraps'
									type='text'
									aria-label='Deixe seu comentário'
								/>
							</div>

							<button>
								Enviar comentário
							</button>
						</form>

						{comentarios.map((comentario) => {
							return (
								<div id='comment'>
									<h1 className='subTitle' />
									<ul style={{ listStyle: 'none' }}>
										<li>
											<div style={{ border: '1px solid #AAAAAA', borderRadius: '40px', padding: '10px' }}>
												<img title={`https://github.com/${comentario.usuario}`} style={{ borderRadius: '10px', width: '30px' }} src={`https://github.com/${comentario.usuario}.png`} />

												<h5>{comentario.scraps}</h5>
											</div>
										</li>
									</ul>
								</div>
							)
						})}

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
										<a href={`/communities/${itemAtual.id}`}>
											<img src={itemAtual.imageUrl} />
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

export async function getServerSideProps(context) {
	const cookies = nookies.get(context)
	const token = cookies.USER_TOKEN
	// console.log('getServerSideProps-token ' + token)
	const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
		headers: {
			Authorization: token
		}
	})
		.then((resposta) => resposta.json())

	// console.log('isAuthenticated ' + isAuthenticated)
	if (isAuthenticated) {
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			}
		}
	}

	const { githubUser } = jwt.decode(token)
	return {
		props: {
			githubUser
		}
	}
}
