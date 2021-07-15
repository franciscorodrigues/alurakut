import { SiteClient } from 'datocms-client'

export default async function recebedorDeRequests(request, response) {
	if (request.method === 'POST') {
		const TOKEN = 'cfe49cca894a4dabd6d55a14c5136c'
		const client = new SiteClient(TOKEN)

		// Validar os dados, antes de sair cadastrando
		const registroCriado = await client.items.create({
			itemType: '967556', // ID do Model de "Communities" do Dato
			...request.body
		})

		// console.log(registroCriado)

		response.json({
			dados: 'Algum dado qualquer',
			registroCriado: registroCriado
		})
		return
	}

	response.status(404).json({
		message: 'Ainda não temos nada no GET, mas no POST tem!'
	})
}
