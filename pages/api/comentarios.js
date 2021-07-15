import { SiteClient } from 'datocms-client'

export default async function recebedorDeRequests(request, response) {
	if (request.method === 'POST') {
		const TOKEN = 'cfe49cca894a4dabd6d55a14c5136c'
		const client = new SiteClient(TOKEN)

		const registroCriado = await client.items.create({
			itemType: '972035', // ID do Model de "comentario" do Dato
			...request.body
		})

		response.json({
			dados: 'retorno... ',
			registroCriado: registroCriado
		})
		return
	}

	response.status(404).json({
		message: 'Não encontrado!'
	})
}
